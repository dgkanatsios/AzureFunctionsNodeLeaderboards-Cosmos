using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ScoresAPI
{
    public static class Globals
    {
        public static bool DebugFlag { get; set; }

        public static readonly string Accept = "Accept";
        public static readonly string Content_Type = "Content-Type";
        public static readonly string ApplicationJson = "application/json";
        public static readonly string ErrorOccurred = "Error occurred";

        public static readonly string PrincipalID ="x-ms-client-principal-id";
        public static readonly string PrincipalName ="x-ms-client-principal-name";
        public static readonly string LibraryVersion = "0.1";
    }
}
