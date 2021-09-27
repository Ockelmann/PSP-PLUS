using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSP_.Tools
{
    public class InternalConection
    {
        public static string GetConection()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

            string conectionPSP = configuration.GetConnectionString("PSP_PLUS");

            return conectionPSP;
        }

    }
}
