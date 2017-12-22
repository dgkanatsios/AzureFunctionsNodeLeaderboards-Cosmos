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
        public void GetUserDetails(string _userID, Action<CallbackResponse<User>> callback)
        {
            Utilities.ValidateForNull(_userID, callback);
            StartCoroutine(GetStuffSingle<User>("/users/" + WWW.EscapeURL(_userID), callback));
        }
        
        //GET https://functionURL/api/user/scores/:count
        public void ListScoresForCurrentUser(int count, Action<CallbackResponse<Score[]>> callback)
        {
            Utilities.ValidateForNull(callback);
            StartCoroutine(GetStuffArray<Score>("/user/scores/" + count, callback));
        }

        //GET https://functionURL/api/scores/top/:count
        public void ListTopScores(int count, Action<CallbackResponse<Score[]>> callback)
        {
            Utilities.ValidateForNull(callback);
            StartCoroutine(GetStuffArray<Score>("/scores/top/" + count, callback));
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
        private IEnumerator GetStuffArray<T>(string url, Action<CallbackResponse<T[]>> callback)
        {
            using (UnityWebRequest www = Utilities.BuildScoresAPIWebRequest
                (GetLeaderboardsAPIURL() + url, HttpMethod.Get.ToString(), null, userID, username))
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

