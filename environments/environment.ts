// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  // serverUrl: "http://localhost:51176/",
  //serverUrl: "http://localhost:5000/",

  serverUrl: "https://taxtoolsd.acgov.org/",   //Dev
   //serverUrl: "https://taxtoolst.acgov.org/",   //QA
  //serverUrl: "https://taxtoolsq.acgov.org/",     //UAT
  //serverUrl: "https://taxtools.acgov.org/",   //Prod

  //serverUrl: "https://taxtoolsnewd.acgov.org/",  //Dev
//serverUrl: "https://taxtoolsnewt.acgov.org/",         //Test
  //serverUrl: "https://taxtoolsnewq.acgov.org/",       // UAT
  //serverUrl: "https://taxtoolsnew.acgov.org/", 
  // userLogin: "cPakalapati",  //  rGadira


  // // //   //Dev
         reportViewer: 'https://ssrspbid.acgov.org/ReportServer/Pages/ReportViewer.aspx',
       reportUrl: 'Development/TaxTools/',
    currentEnvironment: "Dev"

  //   ////QA
      //  reportViewer: 'https://ssrspbid.acgov.org/ReportServer/Pages/ReportViewer.aspx',
      //  reportUrl: 'System Test/TaxTools/',
      //  currentEnvironment: 'QA'

  // // //   ////UAT
    //   reportViewer: 'https://ssrspbid.acgov.org/ReportServer/Pages/ReportViewer.aspx',
    //  reportUrl: 'User Acceptance/TaxTools/',
    //  currentEnvironment: "UAT"

  ////Prod
    //    reportViewer: 'https://ssrspbip.acgov.org/ReportServer/Pages/ReportViewer.aspx',
    //  reportUrl: 'Prod/TaxTools/',
    //    currentEnvironment: "Prod"




};

