using LeaderboardsSDK;
using UnityEngine;
using UnityEngine.UI;


public class LeaderboardsSDKUIScript : MonoBehaviour
{
    public Text StatusText;

    public void Start()
    {
        Globals.DebugFlag = true;

        //get the authentication token somehow...
        //e.g. for facebook, check the Unity Facebook SDK at https://developers.facebook.com/docs/unity
        LeaderboardsSDKClient.Instance.userID = "12345";
        LeaderboardsSDKClient.Instance.username = "dimitris2";

        //check here for more information regarding authentication and authorization in Azure App Service
        //https://azure.microsoft.com/en-us/documentation/articles/app-service-authentication-overview/
    }

    private void ShowError(string error)
    {
        Debug.Log(error);
        StatusText.text = "Error: " + error;
    }



    public void CreateScore()
    {
        Score score = new Score();

        score.value = UnityEngine.Random.Range(10, 100);
        LeaderboardsSDKClient.Instance.CreateScore(score, response =>
        {
            if (response.Status == CallBackResult.Success)
            {
                string result = "Create score completed";
                if (Globals.DebugFlag) Debug.Log(result);
                StatusText.text = result;
            }
            else
            {
                ShowError(response.Exception.Message);
            }
        });
        StatusText.text = "Loading...";
    }
    public void GetUserDetails()
    {
        LeaderboardsSDKClient.Instance.GetUserDetails(LeaderboardsSDKClient.Instance.userID, response =>
        {
            if (response.Status == CallBackResult.Success)
            {
                string result = "Get user details completed";
                if (Globals.DebugFlag)
                {
                    User u = response.Result;
                    Debug.Log("Max score:" + u.maxScoreValue);
                    Debug.Log("Total times played:" + u.totalTimesPlayed);
                    foreach (var score in u.latestScores)
                    {
                        Debug.Log("score:" + score.value);
                    }
                }
                StatusText.text = result;
            }
            else
            {
                ShowError(response.Exception.Message);
            }
        });
        StatusText.text = "Loading...";
    }


    public void ListScoresForCurrentUser()
    {
        LeaderboardsSDKClient.Instance.ListScoresForCurrentUser(10, response =>
        {
            if (response.Status == CallBackResult.Success)
            {
                string result = "List scores for current user completed";
                if (Globals.DebugFlag)
                    foreach (var item in response.Result)
                    {
                        Debug.Log(string.Format("score ID is {0},value is {1}", item._id, item.value));
                    }
                StatusText.text = result;
            }
            else
            {
                ShowError(response.Exception.Message);
            }
        });
        StatusText.text = "Loading...";
    }


    public void ListTopScoresForAllUsers()
    {
        //get the top 10 scores for all users
        LeaderboardsSDKClient.Instance.ListTopScoresForAllUsers(10, response =>
        {
            if (response.Status == CallBackResult.Success)
            {
                string result = "List top scores for all users completed";
                if (Globals.DebugFlag)
                    foreach (var item in response.Result)
                    {
                        Debug.Log(string.Format("username is {0},value is {1}", item.username, item.value));
                    }
                StatusText.text = result;
            }
            else
            {
                ShowError(response.Exception.Message);
            }
        });
        StatusText.text = "Loading...";
    }

}




