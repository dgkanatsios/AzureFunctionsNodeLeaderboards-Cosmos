using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

namespace ScoresAPI
{
    public class ScoresAPIClient : MonoBehaviour
    {
        public string Url;
        public static ScoresAPIClient Instance;

        [HideInInspector]
        public string userID;

        [HideInInspector]
        public string username;

        void Awake()
        {
            Instance = this;
            Utilities.ValidateForNull(Url);
        }



        public void CreateScore(Score instance, Action<CallbackResponse<User>> oncreateScoreCompleted)
        {
            Utilities.ValidateForNull(instance, oncreateScoreCompleted);
            StartCoroutine(CreateScoreInternal(instance, oncreateScoreCompleted));
        }


        public void GetUserDetails(string _userID, Action<CallbackResponse<User>> callback)
        {
            Utilities.ValidateForNull(_userID, callback);
            StartCoroutine(GetUserDetailsInternal(_userID, callback));
        }

        public void ListScoresForCurrentUser(int count, Action<CallbackResponse<Score[]>> callback)
        {
            Utilities.ValidateForNull(callback);
            StartCoroutine(ListScoresForCurrentUserInternal(count, callback));
        }


        private IEnumerator ListScoresForCurrentUserInternal(int count, Action<CallbackResponse<Score[]>> callback)
        {
            using (UnityWebRequest www = Utilities.BuildScoresAPIWebRequest
                (GetScoresAPIURL() + "/user/scores/" + count, HttpMethod.Get.ToString(), null, userID, username))
            {
                yield return www.Send();
                if (Globals.DebugFlag) Debug.Log(www.responseCode);
                CallbackResponse<Score[]> response = new CallbackResponse<Score[]>();
                if (Utilities.IsWWWError(www))
                {
                    if (Globals.DebugFlag) Debug.Log(www.error);
                    Utilities.BuildResponseObjectOnFailure(response, www);
                }
                else
                {
                    try
                    {
                        Score[] data = JsonHelper.GetJsonArray<Score>(www.downloadHandler.text);
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

        private IEnumerator CreateScoreInternal(Score instance, Action<CallbackResponse<User>> onInsertCompleted)
        {
            string json = JsonUtility.ToJson(instance);

            using (UnityWebRequest www = Utilities.BuildScoresAPIWebRequest(GetScoresAPIURL() + "scores",
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

        private IEnumerator GetUserDetailsInternal(string _userID, Action<CallbackResponse<User>> callback)
        {
            using (UnityWebRequest www = Utilities.BuildScoresAPIWebRequest
                (GetScoresAPIURL() + "/users/" + WWW.EscapeURL(_userID), HttpMethod.Get.ToString(), null, userID, username))
            {
                yield return www.Send();
                if (Globals.DebugFlag) Debug.Log(www.responseCode);
                CallbackResponse<User> response = new CallbackResponse<User>();
                if (Utilities.IsWWWError(www))
                {
                    if (Globals.DebugFlag) Debug.Log(www.error);
                    Utilities.BuildResponseObjectOnFailure(response, www);
                }
                else
                {
                    try
                    {
                        User data = JsonUtility.FromJson<User>(www.downloadHandler.text);
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




        private string GetScoresAPIURL()
        {
            return string.Format("{0}/api/", Url);
        }


    }
}

