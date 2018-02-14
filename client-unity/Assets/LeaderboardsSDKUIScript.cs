using LeaderboardsSDK;
using UnityEngine;
using UnityEngine.UI;


public class LeaderboardsSDKUIScript : MonoBehaviour
{
    private Text statusText;

    public void Start()
    {
        Globals.DebugFlag = true;

        statusText = GameObject.Find("StatusText").GetComponent<Text>();

        //get the authentication token(s) somehow...
        //e.g. for facebook, check the Unity Facebook SDK at https://developers.facebook.com/docs/unity
        LeaderboardsSDKClient.Instance.userID = "CURRENT_PLAYER_UNIQUE_ID";
        LeaderboardsSDKClient.Instance.username = "CURRENT_PLAYER_USERNAME";

        //check here for more information regarding authentication and authorization in Azure App Service
        //https://azure.microsoft.com/en-us/documentation/articles/app-service-authentication-overview/
    }

    public void ClearOutput()
    {
        statusText.text = string.Empty;
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
                if (Globals.DebugFlag) WriteLine(result.ToString());
            }
            else
            {
                WriteLine(response.Exception.Message);
            }
        });
        WriteLine("Loading...");
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
                    WriteLine("Max score:" + u.maxScoreValue);
                    WriteLine("Total times played:" + u.totalTimesPlayed);
                    foreach (var score in u.latestScores)
                    {
                        WriteLine("score:" + score.value);
                    }
                }
                WriteLine(result);
            }
            else
            {
                WriteLine(response.Exception.Message);
            }
        });
        WriteLine("Loading...");
    }


    public void ListScoresForCurrentUser()
    {
        LeaderboardsSDKClient.Instance.ListScoresForCurrentUser(10, 0, response =>
        {
            if (response.Status == CallBackResult.Success)
            {
                string result = "List scores for current user completed";
                if (Globals.DebugFlag)
                    foreach (var item in response.Result)
                    {
                        WriteLine(string.Format("score ID is {0},value is {1}", item._id, item.value));
                    }
                WriteLine(result);
            }
            else
            {
                WriteLine(response.Exception.Message);
            }
        });
        WriteLine("Loading...");
    }


    public void ListTopScores()
    {
        //get the top 10 scores for all users
        LeaderboardsSDKClient.Instance.ListTopScores(10, 0, response =>
         {
             if (response.Status == CallBackResult.Success)
             {
                 string result = "List top scores for all users completed";
                 if (Globals.DebugFlag)
                     foreach (var item in response.Result)
                     {
                         WriteLine(string.Format("username is {0},value is {1}", item.username, item.value));
                     }
                 WriteLine(result);
             }
             else
             {
                 WriteLine(response.Exception.Message);
             }
         });
        WriteLine("Loading...");
    }

    public void ListTopScoresSkip()
    {
        //get the top 10 scores for all users, skipping 2
        LeaderboardsSDKClient.Instance.ListTopScores(10, 2, response =>
        {
            if (response.Status == CallBackResult.Success)
            {
                string result = "List top scores for all users (skipping 2) completed";
                if (Globals.DebugFlag)
                    foreach (var item in response.Result)
                    {
                        WriteLine(string.Format("username is {0},value is {1}", item.username, item.value));
                    }
                WriteLine(result);
            }
            else
            {
                WriteLine(response.Exception.Message);
            }
        });
        WriteLine("Loading...");
    }

    public void WriteLine(string s)
    {
        if (statusText.text.Length > 20000)
            statusText.text = string.Empty + "-- TEXT OVERFLOW --";

        statusText.text += s + "\r\n";
    }

}




