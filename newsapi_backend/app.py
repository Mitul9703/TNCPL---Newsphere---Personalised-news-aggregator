from flask import Flask, request, jsonify
import pandas as pd
from recom_funcs import *
from scipy.sparse import load_npz
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import google.generativeai as genai
import os
import PIL.Image
from sklearn.feature_extraction.text import TfidfVectorizer
import random

# Set the API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyCsDkOoLBlgWXmknhL3AF6wfMBAM7A_aX8"

# Configure the Generative AI library
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])



print("Initialising Firebase......")
# Use the application default credentials
cred = credentials.Certificate('tncpl-newsapi-firebase-adminsdk-xbfj9-5e7fd627ae.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

print("Firebase Initialised.")

print("Loading dataset and matrix......")
# Load the TF-IDF matrix
tfidf_matrix = load_npz('tfidf_matrix_popular.npz')

# Load the DataFrame
df_cleaned = pd.read_pickle('df_cleaned_popular.pkl')
print(df_cleaned.head(2))


tfidf = TfidfVectorizer(max_features=1000)
tfidf_matrix_titles = tfidf.fit_transform(df_cleaned['title'])


print("Dataset and matrix loaded.")
app = Flask(__name__)

last_recommended = {}


@app.route('/search', methods=['GET'])
def search_articles():
    query = request.args.get('query', '')  # Get the search query from URL parameters
    top_n = request.args.get('top_n', default=15, type=int)

    try:
        # Ensure the 'date' column is parsed as a datetime type
        df_cleaned['date'] = pd.to_datetime(df_cleaned['date'])

        # Transform the search query using the pre-fitted TF-IDF vectorizer
        query_vector = tfidf.transform([query])

        # Compute cosine similarity between the query vector and all article title vectors
        cosine_similarities = cosine_similarity(query_vector, tfidf_matrix_titles).flatten()

        # Get indices of articles sorted by similarity (from highest to lowest)
        sorted_by_similarity_indices = np.argsort(cosine_similarities)[::-1]

        # Fetch articles and sort them by similarity first
        sorted_articles = df_cleaned.iloc[sorted_by_similarity_indices]

        # Now, sort these articles by date within the top N similar articles
        sorted_articles = sorted_articles.head(top_n * 2)  # Fetch more to account for date sorting
        sorted_articles = sorted_articles.sort_values(by='date', ascending=False).head(top_n)

        # Prepare the response data format
        response_data = sorted_articles[[
            'uri', 'title', 'body', 'category', 'image', 'url', 'source_title', 'source_uri', 'date'
        ]].to_dict(orient='records')

        return jsonify({'search_results': response_data})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500



#NEwsLens Feature

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'photo' in request.files:
        print("Upload Request")
        top_n = 5
        photo = request.files['photo']
        img_path = r".\ar_photo\prompt_photo"
        photo.save(img_path)
        img = PIL.Image.open(r".\ar_photo\prompt_photo")
        model = genai.GenerativeModel('gemini-pro-vision')
        response = model.generate_content(["Extract the headline text of the news article, that is not cut, in the picture. if no headlines say 'No titles found' ", img], stream=True)
        response.resolve()
        headline_fin=response.text
        print(headline_fin)
        tfidf_vector = tfidf.transform([headline_fin])
                # Compute cosine similarity between the query vector and all article title vectors
        cosine_similarities = cosine_similarity(tfidf_vector, tfidf_matrix_titles).flatten()
        
        # Get indices of articles sorted by similarity (from highest to lowest)
        sorted_by_similarity_indices = np.argsort(cosine_similarities)[::-1]

        # Fetch articles and sort them by similarity first
        sorted_articles = df_cleaned.iloc[sorted_by_similarity_indices]

        # Now, sort these articles by date within the top N similar articles
        sorted_articles = sorted_articles.head(top_n * 2)  # Fetch more to account for date sorting
        sorted_articles = sorted_articles.sort_values(by='date', ascending=False).head(top_n)
        
        response_data = sorted_articles[[
            'uri', 'title', 'body', 'category', 'image', 'url', 'source_title','source_uri', 'date'
        ]].to_dict(orient='records')

       
        
        return jsonify({'recommendations': response_data})

    return {'message': 'No photo found'}, 400


@app.route('/trending', methods=['GET'])
def get_trending_articles():
    # Optional: Get a parameter to customize the number of articles returned
    top_n = request.args.get('top_n', default=10, type=int)

    try:
        # Ensure your date column is parsed as datetime type
        df_cleaned['date'] = pd.to_datetime(df_cleaned['date'])
        # Filter and sort by date close to the current date
        trending_df = df_cleaned.sort_values(by='date', ascending=False).head(top_n)
        
        # Prepare the response data format
        response_data = trending_df[[
            'uri', 'title', 'body', 'category', 'image', 'url', 'source_title', 'source_uri', 'date'
        ]].to_dict(orient='records')

        return jsonify({'trending': response_data})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    user_id = request.json.get('user_id')
    top_n = 20  # You can pass the total number of recommendations as a parameter
    click_history_ratio = 0.6  # 60% from click history
    last_uris = last_recommended.get(user_id, [])
    
    print("Request: ", user_id)
    doc_ref = db.collection('users').document(user_id)
    try:
        doc = doc_ref.get()
        user_data = doc.to_dict()
        response_data = []

        if user_data:
            # Calculate the count for recommendations based on click history and preferences
            num_click_history = int(top_n * click_history_ratio) if 'clicks_history' in user_data and user_data['clicks_history'] else 0
            num_preferred = top_n - num_click_history
            print("Nums clicked : ", num_click_history, "Num pref : ", num_preferred)
            # Get recommendations based on click history
            click_history_recommendations = pd.DataFrame()
            if num_click_history > 0:
                click_history_recommendations = recommend_based_on_clicks(
                    user_data['clicks_history'], df_cleaned, tfidf_matrix, top_n=num_click_history, exclude_uris=last_uris  
                )

            
            preferred_category_recommendations = pd.DataFrame()
            if num_preferred > 0:
                preferred_category_recommendations = recommend_for_new_user(
                    user_data['preferred_categories'], df_cleaned, tfidf_matrix, top_n=num_preferred,exclude_uris=last_uris
                )

            combined_recommendations = pd.concat([click_history_recommendations, preferred_category_recommendations]).drop_duplicates().head(top_n)
            response_data.extend(combined_recommendations[[
                'uri', 'title', 'body', 'category', 'image', 'url', 'source_title', 'source_uri', 'date'
            ]].to_dict(orient='records'))

            # Update last recommended URIs
            last_recommended[user_id] = combined_recommendations['uri'].tolist()

            if not response_data:
                return jsonify({'recommendations': [], 'message': 'Unable to get recommendation'})
            
            # Shuffle the combined recommendations before sending
            random.shuffle(response_data)
            
            return jsonify({'recommendations': response_data})
        else:
            return jsonify({'message': 'User data not found'}), 404

    except Exception as e:
        print("Error: ", e)
        return jsonify({"error": str(e)}), 500

        


if __name__ == '__main__':
    app.run(debug=True,port = 5000)
