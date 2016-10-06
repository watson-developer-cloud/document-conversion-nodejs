import React from 'react';
import ReactDOM from 'react-dom';
import { Header, Jumbotron, Code, Tabs } from 'watson-react-components';
import Demo from './demo.jsx'

ReactDOM.render(<div>
    <Header mainBreadcrumbs="Document Conversion" mainBreadcrumbsUrl="http://www.ibm.com/watson/developercloud/document-conversion.html" />
    <Jumbotron
        serviceName="Document Conversion"
        repository="https://github.com/watson-developer-cloud/document-conversion-nodejs"
        documentation="http://www.ibm.com/watson/developercloud/doc/document-conversion"
        apiReference="http://www.ibm.com/watson/developercloud/document-conversion/api/v1/"
        version="GA"
        serviceIcon="/images/document-conversion.svg"
        description="The Document Conversion service transforms HTML, PDF, and Microsoft™ Word documents into normalized HTML, plain text, or sets of Answer units. The Answer units can be run through a utility to convert it to the Solr JSON file type needed to train the Retrieve and Rank service."
    />
    <Demo/>
</div>, document.getElementById('root'));
