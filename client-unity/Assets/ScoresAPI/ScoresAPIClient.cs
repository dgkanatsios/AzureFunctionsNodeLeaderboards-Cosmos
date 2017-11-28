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



        #region Public methods



        public void CreateScore(Score instance, Action<CallbackResponse<User>> oncreateScoreCompleted)
        {
            Utilities.ValidateForNull(instance, oncreateScoreCompleted);
            StartCoroutine(CreateScoreInternal(instance, oncreateScoreCompleted));
        }


        public void SelectByID<T>(string id, Action<CallbackResponse<T>> onSelectByIDCompleted)
        {
            Utilities.ValidateForNull(id, onSelectByIDCompleted);
            StartCoroutine(SelectByIDInternal<T>(id, onSelectByIDCompleted));
        }

            

        #endregion

     

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

        private IEnumerator SelectByIDInternal<T>(string id, Action<CallbackResponse<T>> onSelectByIDCompleted)
        {
            using (UnityWebRequest www = Utilities.BuildScoresAPIWebRequest
                (GetScoresAPIURL() + "/" + WWW.EscapeURL(id), HttpMethod.Get.ToString(), null, userID, username))
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
                onSelectByIDCompleted(response);
            }
        }

      
       

        private string GetScoresAPIURL()
        {
            return string.Format("{0}/api/", Url);
        }

       
    }
}

