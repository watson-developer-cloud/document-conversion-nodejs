import React from 'react';
import { Header, Jumbotron } from 'watson-react-components';

function Layout(props) {
  return (
    <html lang="en">
      <head>
        <title>Document Conversion Demo</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Document Conversion capabilities have been migrated to Watson Discovery. Take advantage of improvements to PDF conversion using Watson Discovery." />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" href="/css/watson-react-components.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        {/* Bluemix Analytics - begin*/}
        <script type="text/javascript">{`
                window._analytics = { coremetrics: false, optimizely: false, addRoll: false };
                `}</script>
        <meta name="segment" property="watson-demos" value="document-conversion-demo" />
        <script src={props.bluemixAnalytics} />
        {/* Bluemix Analytics  - end*/}

      </head>
      <body>
        <Header
          mainBreadcrumbs="Document Conversion"
          mainBreadcrumbsUrl="http://www.ibm.com/watson/developercloud/document-conversion.html"
        />
        <Jumbotron
          serviceName="Document Conversion"
          repository="https://github.com/watson-developer-cloud/document-conversion-nodejs"
          documentation="http://www.ibm.com/watson/developercloud/doc/document-conversion"
          apiReference="http://www.ibm.com/watson/developercloud/document-conversion/api/"
          version="GA"
          startInBluemix="https://console.ng.bluemix.net/registration/?target=/catalog/services/document-conversion/"
          serviceIcon="/images/document-conversion.svg"
          description={[<span className="deprecation--notice">Document Conversion is deprecated as a stand-alone service. Learn more about the <a href="https://ibm.biz/rnr_dcs_announcement">announcement</a> and migration path to switch to  <a href="https://ibm.biz/rnr_dcs_migration">Watson Discovery</a></span>]} // eslint-disable-line
        />
        <div id="root">
          {props.children}
        </div>
        <script type="text/javascript" src="js/bundle.js" />
        <script type="text/javascript" src="js/vendors/google-analytics.js" defer async />
      </body>
    </html>
  );
}

Layout.propTypes = {
  children: React.PropTypes.object.isRequired,
  bluemixAnalytics: React.PropTypes.string,
};

export default Layout;
