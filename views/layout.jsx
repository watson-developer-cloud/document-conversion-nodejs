import React from 'react';
import { Header, Jumbotron } from 'watson-react-components';

export default function(props) {
    return (
        <html>
            <head>
                <title>Document Conversion Demo</title>
                <meta charset="utf-8"/>
                <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
                <link rel="stylesheet" href="/css/watson-react-components.min.css"/>
                <link rel="stylesheet" href="/css/style.css"/>
            </head>
            <body>
                <Header mainBreadcrumbs="Document Conversion" mainBreadcrumbsUrl="http://www.ibm.com/watson/developercloud/document-conversion.html" />
                <Jumbotron
                    serviceName="Document Conversion"
                    repository="https://github.com/watson-developer-cloud/document-conversion-nodejs"
                    documentation="http://www.ibm.com/watson/developercloud/doc/document-conversion"
                    apiReference="http://www.ibm.com/watson/developercloud/document-conversion/api/"
                    version="GA"
                    startInBluemix="https://console.ng.bluemix.net/registration/?target=/catalog/services/document-conversion/"
                    serviceIcon="/images/document-conversion.svg"
                    description="The Document Conversion service transforms HTML, PDF, and Microsoft™ Word documents into normalized HTML, plain text, or sets of Answer units. The Answer units can be run through a utility to convert it to the Solr JSON file type needed to train the Retrieve and Rank service."
                />
                <div id="root">
                {props.children}
                </div>
            <script type="text/javascript" src="js/bundle.js"></script>
            <script type="text/javascript" src="js/vendors/google-analytics.js" defer async></script>
            </body>
    </html>
    );
}
