using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

namespace LeaderboardsSDK
{
    public class LeaderboardsSDKClient : MonoBehaviour
    {
        public string Url;
        public static LeaderboardsSDKClient Instance;

        [HideInInspector]
        public string userID;

        [HideInInspector]
        public string username;

        void Awake()
        {
            Instance = this;
            Utilities.ValidateForNull(Url);
        }


        //POST https://functionURL/api/scores
        public void CreateScore(Score instance, Action<CallbackResponse<User>> oncreateScoreCompleted)
        {
            Utilities.ValidateForNull(instance, oncreateScoreCompleted);
            StartCoroutine(PostScoreInternal(instance, oncreateScoreCompleted));
        }

        //GET https://functionURL/api/users/:userId
        public void GetUserDetails(string userID, Action<CallbackResponse<User>> callback)
        {
            Utilities.ValidateForNull(userID, callback);
            StartCoroutine(GetStuffSingle<User>("/users/" + WWW.EscapeURL(userID), callback));
        }

        //GET https://functionURL/api/user/scores/:count
        public void ListScoresForCurrentUser(int count, int skipCount, Action<CallbackResponse<Score[]>> callback)
        {
            Utilities.ValidateForNull(callback);
            StartCoroutine(GetStuffArray<Score>("/user/scores/" + count, skipCount, callback));
        }

        //GET https://functionURL/api/scores/top/:count
        public void ListTopScores(int count, int skipCount, Action<CallbackResponse<Score[]>> callback)
        {
            Utilities.ValidateForNull(callback);
            StartCoroutine(GetStuffArray<Score>("/scores/top/" + count, skipCount, callback));
        }

        //GET https://functionURL/api/users/maxscore/:count
        public void ListTopScorePerUser(int count, int skipCount, Action<CallbackResponse<Score[]>> callback)
        {
            Utilities.ValidateForNull(callback);
            StartCoroutine(GetStuffArray<Score>("/users/maxscore/" + count, skipCount, callback));
        }

        //GET https://functionURL/api/scores/top/today/:count
        public void ListTodayTopScores(int count, int skipCount, Action<CallbackResponse<Score[]>> callback)
        {
            Utilities.ValidateForNull(callback);
            StartCoroutine(GetStuffArray<Score>("/scores/top/today/" + count, skipCount, callback));
        }

        //GET https://functionURL/api/users/toptotaltimesplayed/:count 
        public void ListTopScorePerUser(int count, Action<CallbackResponse<User[]>> callback, int skipCount = 0)
        {
            Utilities.ValidateForNull(callback);
            StartCoroutine(GetStuffArray<User>("/users/toptotaltimesplayed/" + count, skipCount, callback));
        }

        //GET https://functionURL/api/scores/latest/:count
        public void ListLatestScores(int count, Action<CallbackResponse<Score[]>> callback, int skipCount = 0)
        {
            Utilities.ValidateForNull(callback);
            StartCoroutine(GetStuffArray<Score>("/scores/latest/today/" + count, skipCount, callback));
        }

        //GET https://functionURL/api/scores/:scoreId
        public void ListScore(string scoreId, Action<CallbackResponse<Score>> callback)
        {
            Utilities.ValidateForNull(scoreId, callback);
            StartCoroutine(GetStuffSingle<Score>("/scores/" + scoreId, callback));
        }

        //GET https://functionURL/api/users/surroundingbyscore/:userId/:count
        public void ListUsersSurroundingByScore(string userId, int count, Action<CallbackResponse<User[]>> callback)
        {
            //skipping is not relevant here
            Utilities.ValidateForNull(userId, callback);
            StartCoroutine(GetStuffArray<User>("/users/surroundingbyscore/" + userId + "/" + count, 0, callback));
        }

        private IEnumerator PostScoreInternal(Score instance, Action<CallbackResponse<User>> onInsertCompleted)
        {
            string json = JsonUtility.ToJson(instance);

            using (UnityWebRequest www = Utilities.BuildScoresAPIWebRequest(GetLeaderboardsAPIURL() + "scores",
                HttpMethod.Post.ToString(), json, userID, username))
            {
                yield return www.Send();
                if (Globals.DebugFlag) Debug.Log(www.responseCode);

                CallbackResponse<User> response = new CallbackResponse<User>();

                if (Utilities.IsWWWError(www))
                {
                    if (Globals.DebugFlag) Debug.Log(www.error);
                    Utilities.BuildResponseObjectOnFailure(response, www);
                }

                else if (www.downloadHandler != null)  //all OK
                {
                    //let's get the new object that was created
                    try
                    {
                        User newObject = JsonUtility.FromJson<User>(www.downloadHandler.text);
                        if (Globals.DebugFlag) Debug.Log("new object is " + newObject.ToString());
                        response.Status = CallBackResult.Success;
                        response.Result = newObject;
                    }
                    catch (Exception ex)
                    {
                        response.Status = CallBackResult.DeserializationFailure;
                        response.Exception = ex;
                    }
                }
                onInsertCompleted(response);
            }
        }
        private IEnumerator GetStuffSingle<T>(string url, Action<CallbackResponse<T>> callback)
        {
            using (UnityWebRequest www = Utilities.BuildScoresAPIWebRequest
                (GetLeaderboardsAPIURL() + url, HttpMethod.Get.ToString(), null, userID, username))
            {
                yield return www.Send();
                if (Globals.DebugFlag) Debug.Log(www.responseCode);
                CallbackResponse<T> response = new CallbackResponse<T>();
                if (Utilities.IsWWWError(www))
                {
                    if (Globals.DebugFlag) Debug.Log(www.error);
                    Utilities.BuildResponseObjectOnFailure(response, www);
                }
                else
                {
                    try
                    {
                        T data = JsonUtility.FromJson<T>(www.downloadHandler.text);
                        response.Result = data;
                        response.Status = CallBackResult.Success;
                    }
                    catch (Exception ex)
                    {
                        response.Status = CallBackResult.DeserializationFailure;
                        response.Exception = ex;
                    }
                }
                callback(response);
            }
        }
        private IEnumerator GetStuffArray<T>(string url, int skipCount, Action<CallbackResponse<T[]>> callback)
        {
            string fullurl = GetLeaderboardsAPIURL() + url;
            if (skipCount < 0)
                throw new ArgumentException("skipCount cannot be less than zero");
            else if (skipCount > 0)
                fullurl += "?skip=" + skipCount;

            using (UnityWebRequest www = Utilities.BuildScoresAPIWebRequest
                (fullurl, HttpMethod.Get.ToString(), null, userID, username))
            {
                yield return www.Send();
                if (Globals.DebugFlag) Debug.Log(www.responseCode);
                var response = new CallbackResponse<T[]>();
                if (Utilities.IsWWWError(www))
                {
                    if (Globals.DebugFlag) Debug.Log(www.error);
                    Utilities.BuildResponseObjectOnFailure(response, www);
                }
                else
                {
                    try
                    {
                        T[] data = JsonHelper.GetJsonArray<T>(www.downloadHandler.text);
                        response.Result = data;
                        response.Status = CallBackResult.Success;
                    }
                    catch (Exception ex)
                    {
                        response.Status = CallBackResult.DeserializationFailure;
                        response.Exception = ex;
                    }
                }
                callback(response);
            }
        }

        private string GetLeaderboardsAPIURL()
        {
            return string.Format("{0}/api/", Url);
        }


    }
}

