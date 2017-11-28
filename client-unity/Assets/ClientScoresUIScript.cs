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

    public void SelectFilteredCount()
    {
        SelectFilteredExecute(true);
    }

    private void SelectFilteredExecute(bool includeTotalCount)
    {
        //string filterquery = "score gt 50 and startswith(playername,'dimi')";

        //TableQuery tq = new TableQuery();
        //tq.filter = filterquery;
        //tq.orderBy = "score";
        //tq.inlineCount = includeTotalCount;

        //EasyTablesClient.Instance.SelectFiltered<Highscore>(tq, x =>
        //{
        //    if (x.Status == CallBackResult.Success)
        //    {
        //        foreach (var item in x.Result.results)
        //        {
        //            if (Globals.DebugFlag) Debug.Log(string.Format("ID is {0},score is {1},name is {2}", item.id, item.score, item.playername));
        //        }
        //        if (includeTotalCount)
        //        {
        //            StatusText.text = string.Format("Brought {0} rows out of {1}", x.Result.results.Count(), x.Result.count);
        //        }
        //        else
        //        {
        //            StatusText.text = string.Format("Brought {0} rows", x.Result.results.Count());
        //        }
        //    }
        //    else
        //    {
        //        ShowError(x.Exception.Message);
        //    }
        //});
        //StatusText.text = "Loading...";
    }



    public void SelectByID()
    {
        //EasyTablesClient.Instance.SelectByID<Highscore>("ecca86cb-8e35-47ac-8eef-74dc2ef87faa", x =>
        //{
        //    if (x.Status == CallBackResult.Success)
        //    {
        //        Highscore hs = x.Result;
        //        if (Globals.DebugFlag) Debug.Log(hs.score);
        //        StatusText.text = "score of selected Highscore entry is " + hs.score;
        //    }
        //    else
        //    {
        //        ShowError(x.Exception.Message);
        //    }
        //});
        //StatusText.text = "Loading...";
    }

}




