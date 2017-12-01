using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LeaderboardsSDK
{
    [Serializable()]
    public class User
    {
        public string _id;
        public string username;
        public DateTime createdAt;
        public int maxScoreValue;
        public int totalTimesPlayed;
        public Score[] latestScores;
    }
}
