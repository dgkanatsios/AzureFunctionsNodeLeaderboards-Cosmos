using ScoresAPI;
using UnityEngine;
using UnityEngine.UI;


public class ClientScoresUIScript : MonoBehaviour
{
    public Text StatusText;

    public void Start()
    {
        Globals.DebugFlag = true;

        if (Globals.DebugFlag)
            Debug.Log("instantiated Azure Services for Unity, version " + Globals.LibraryVersion);

        //get the authentication token somehow...
        //e.g. for facebook, check the Unity Facebook SDK at https://developers.facebook.com/docs/unity
        ScoresAPIClient.Instance.userID = "12345";
        ScoresAPIClient.Instance.username = "dimitris2";

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
        ScoresAPIClient.Instance.CreateScore(score, createResponse =>
        {
            if (createResponse.Status == CallBackResult.Success)
            {
                string result = "Create score completed";
                if (Globals.DebugFlag) Debug.Log(result);
                StatusText.text = result;
            }
            else
            {
                ShowError(createResponse.Exception.Message);
            }
        });
        StatusText.text = "Loading...";
    }

    public void ListScoresForCurrentUser()
    {
        ScoresAPIClient.Instance.ListScoresForCurrentUser(10, createResponse =>
        {
            if (createResponse.Status == CallBackResult.Success)
            {
                string result = "Create score completed";
                if (Globals.DebugFlag)
                    foreach (var item in createResponse.Result)
                    {
                        Debug.Log(string.Format("ID is {0},value is {1}", item._id, item.value));
                    }
                StatusText.text = result;
            }
            else
            {
                ShowError(createResponse.Exception.Message);
            }
        });
        StatusText.text = "Loading...";
    }

   
    public void SelectByID()
    {
        ScoresAPIClient.Instance.GetUserDetails(ScoresAPIClient.Instance.userID, response =>
        {
            if (response.Status == CallBackResult.Success)
            {
                string result = "Create score completed";
                if (Globals.DebugFlag)
                {
                    User u = response.Result;
                    Debug.Log(u.maxScoreValue);
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




