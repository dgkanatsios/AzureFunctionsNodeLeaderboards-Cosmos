using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace LeaderboardsSDK
{

    [Serializable()]
    public class Score
    {
        public string _id;
        public int value;
        public string description;
        public string username;
    }
}
