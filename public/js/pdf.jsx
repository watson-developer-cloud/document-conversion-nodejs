import React from 'react';

export default function PDF(props) {
    return (
        <div className="file-display--input-pdf-container">
            <object className="input-embed" data={props.url} type="application/pdf">
                <embed className="input-embed" src={props.url} type="application/pdf"/>
            </object>
        </div>
    );
}

PDF.propTypes = {
    url: React.PropTypes.string
};
