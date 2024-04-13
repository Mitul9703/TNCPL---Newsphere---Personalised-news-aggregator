from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix


def get_article_index_by_uri(uri, df):
    # Ensure the URI exists in the DataFrame to prevent IndexError
    if uri in df['uri'].values:
        return df.index[df['uri'] == uri].tolist()[0]
    return None

def create_initial_user_profile(category_preferences, df, tfidf_matrix):
    articles_indices = df[df['category'].isin(category_preferences)].index
    if articles_indices.empty:
        return np.array([]).reshape(0, tfidf_matrix.shape[1])  # Return empty 2D array if no articles found

    user_profile_vector = tfidf_matrix[articles_indices].mean(axis=0)
    return user_profile_vector


def recommend_articles(user_profile_vector, tfidf_matrix, df_articles, top_n=10, exclude_uris=None, diversity_threshold=0.7):
    if user_profile_vector.shape[0] == 0:
        return pd.DataFrame()  # Return empty DataFrame if user profile vector is empty
    
    # Calculate the cosine similarity between the user profile and all article vectors
    cosine_similarities = cosine_similarity(user_profile_vector, tfidf_matrix).flatten()

    # Sort articles by their similarity scores in descending order
    sorted_indices = np.argsort(cosine_similarities)[::-1]
    
    recommended_articles = []
    for idx in sorted_indices:
        if len(recommended_articles) >= top_n:
            break
        
        current_uri = df_articles.iloc[idx]['uri']
        # Check if the current article should be excluded
        if exclude_uris and current_uri in exclude_uris:
            continue

        # Ensure there are already recommended articles to compare against
        if recommended_articles:
            article_similarities = cosine_similarity(
                tfidf_matrix[idx:idx+1],  # Reshape index into slice for 2D array
                tfidf_matrix[recommended_articles]).flatten()
        
            # Check if the article is different enough from already recommended articles
            if all(sim < diversity_threshold for sim in article_similarities):
                recommended_articles.append(idx)
        else:
            recommended_articles.append(idx)  # Add first article without comparison
    
    if not recommended_articles:
        return pd.DataFrame()  # Return empty DataFrame if no articles meet the criteria
    
    return df_articles.iloc[recommended_articles]



def recommend_for_new_user(user_preferences, df, tfidf_matrix, top_n=10, exclude_uris=None):
    # Get the number of recommendations per category
    num_per_category = max(top_n // len(user_preferences), 1)
    
    all_recommendations = []
    for category in user_preferences:
        category_articles_indices = df[df['category'] == category].index
        if not category_articles_indices.empty:
            category_profile_vector = tfidf_matrix[category_articles_indices].mean(axis=0)
            if isinstance(category_profile_vector, csr_matrix):
                category_profile_vector = category_profile_vector.toarray()
            category_profile_vector = np.asarray(category_profile_vector).reshape(1, -1)  # Ensure it's 2D
            category_recommendations = recommend_articles(
                category_profile_vector, tfidf_matrix, df, top_n=num_per_category, exclude_uris=exclude_uris
            )
            all_recommendations.append(category_recommendations)
    
    # Concatenate all recommendations and pick top_n
    if all_recommendations:
        recommendations_df = pd.concat(all_recommendations).drop_duplicates().head(top_n)
        return recommendations_df
    else:
        return pd.DataFrame()





def recommend_based_on_clicks(user_clicks_uris, df, tfidf_matrix, top_n=10, exclude_uris=None,diversity_threshold = 0.7):
    """Recommend articles based on articles a user has clicked on, excluding specific URIs."""
    clicked_indices = [get_article_index_by_uri(uri, df) for uri in user_clicks_uris]
    
    # Ensure only valid indices are used
    clicked_indices = [idx for idx in clicked_indices if idx is not None and idx < tfidf_matrix.shape[0]]
    
    if not clicked_indices:
        return pd.DataFrame()  # Return empty DataFrame if no valid clicks
    
    # Aggregate TF-IDF vectors of clicked articles
    user_profile_vector = tfidf_matrix[clicked_indices].mean(axis=0)
    
    if isinstance(user_profile_vector, csr_matrix):
        user_profile_vector = user_profile_vector.toarray()
    user_profile_vector = np.asarray(user_profile_vector).reshape(1, -1)  # Ensure it's 2D

    # Compute cosine similarity
    similarities = cosine_similarity(user_profile_vector, tfidf_matrix)
    
    # Sort articles by their similarity scores in descending order
    sorted_indices = np.argsort(similarities.flatten())[::-1]
    
    recommended_articles = []
    for idx in sorted_indices:
        if len(recommended_articles) >= top_n:
            break
        
        # Check if the current article should be excluded
        current_uri = df.iloc[idx]['uri']
        if exclude_uris and current_uri in exclude_uris:
            continue

                # Ensure there are already recommended articles to compare against
        if recommended_articles:
            article_similarities = cosine_similarity(
                tfidf_matrix[idx:idx+1],  # Reshape index into slice for 2D array
                tfidf_matrix[recommended_articles]).flatten()
        
            # Check if the article is different enough from already recommended articles
            if all(sim < diversity_threshold for sim in article_similarities):
                recommended_articles.append(idx)
        else:
            recommended_articles.append(idx)

        # Add the index if not in clicked indices and not in excluded URIs
        if idx not in clicked_indices:
            recommended_articles.append(idx)
    
    if not recommended_articles:
        return pd.DataFrame()  # Return empty DataFrame if no articles meet the criteria
    
    return df.iloc[recommended_articles]

