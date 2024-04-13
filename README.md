# TNCPL050 - Newsphere : Your personalized news aggregator

## IMPORTANT!!!
## Please visit the following link for the Mobile app's video demostration and working and the project report
  ### - https://drive.google.com/drive/folders/1L-JTnvzR73yzERxmBL5tPcVzq3ivU8oD?usp=sharing


## Project Demo Video
 ### - https://drive.google.com/file/d/1L5EkkMUDsYHlPaHpB03Kp3U8qVIrcGwW/view?usp=drive_link

## Project report
 ### - https://drive.google.com/file/d/1sGRXYOl09Uz9_yZH1bOy_QSwpkPg0uCl/view?usp=sharing


## Information
  - `Newsphere` is the mobile app.
  - `newsapi_backend` is the flask api backend.
  - `indicTrans_API_run_on_kaggle_using_ngrok` gives the kaggle file to run the Language Translation endpoint
     - Kaggle link - https://www.kaggle.com/code/mitul777/indictrans .
  - `content-based-filtering` gives the kaggle file where the CBF logic is implemented.
     - Kaggle link - https://www.kaggle.com/code/mitul777/news-recom


# Newsphere

![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/215edb91-0ddb-4870-afb7-ff5703f785dd)


## Login Screen

![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/eff259d1-9eff-4cce-b0f9-c7988558930e)

## Tracking and Preference

![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/821725fa-0238-4633-8be6-037714b8b4eb)

## Home Screen/Feed Screen

![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/ab2bda01-b7df-40e6-8e5e-becd8b3f2f93)


## Recommendation Logic

![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/9c5869b3-b8a9-4638-81e7-4bfef3581617)

## Backend API Logic

![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/aae42a12-a846-4b84-8fd1-92c6c310a86c)

## Native Language Translation of articles

![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/3fcc0809-28f5-4b5b-b763-78f4657c8a7c)
![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/c4ada7d1-64b1-4562-81df-b290ed6e23fb)
![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/1228466b-7e9e-4f36-a698-969885de7b6d)

## NewsLens Feature
![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/2f4978c7-ab9a-47f5-a72d-22990acedcbc)
![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/bf2ed3e8-8f4d-4f9a-868d-52e2f510fe85)

## Drive Mode feature
![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/f2a5a7d7-858a-4aca-a1cf-8bb2c2eae7f9)

## Trending Tab
![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/4de4199c-84c8-42ef-b828-5789242fa866)

## Search Tab
![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/433d4bd4-8d73-42b1-9f15-613f8ecbc9ca)

## Techstack
![image](https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator/assets/60043776/cb44a705-8e75-4902-816f-5c8effa5b1b8)


### Video Demonstration
Watch a full demo of the app [here](https://drive.google.com/file/d/1L5EkkMUDsYHlPaHpB03Kp3U8qVIrcGwW/view?usp=sharing).

### Project Report
Read the detailed project report [here](https://drive.google.com/file/d/1L5EkkMUDsYHlPaHpB03Kp3U8qVIrcGwW/view?usp=sharing).




### Instructions

To run this expo user app

- Clone this repository in your local system
  `git clone https://github.com/Mitul9703/TNCPL---Newsphere---Personalised-news-aggregator.git`
- cd into the Newsphere directory `cd Newsphere' and run the following command to install necessary packages.
  `npm i`
- Run the following command to start bundling and host the development server.
    `npx expo start`
- Scan the QR code appearing on the terminal with your Expo Go app.
- If you're not able to connect the development server to your Expo Go, then run the following command instead
    `npx expo start --tunnel`

To run the flask backend api endpoints

- cd into newsapi_backend `cd newsapi_backend` and install required packages by runnin `pip install -r requirements.txt`.
- Run `python3 app.py` and `ngrok http 5000`.
- Copy and paste the ngrok url in `Newsphere\contants\NgrokURL.js` and then hit `ctrl + s`.

To run the Laguage Translation API endpoint

- Open Kaggle and import the ipynb file in `indicTrans_API_run_on_kaggle_using_ngrok` folder.
- Choose GPUP100 as accelerator and click `run all`.
- Copy and past the ngrok url found in the output of the last cell in `Newsphere/NAtiveLanguageScreen.js`
  `const response = await fetch(
        "<Paste Ngrok URl here >/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: item.title,
            body: item.body,
            target_lang: selectedLanguage,
          }),
        }
      );`
  - Hit `ctrl + s`.
