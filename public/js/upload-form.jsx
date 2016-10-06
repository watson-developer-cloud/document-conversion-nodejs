import React from 'react'
// todo: check if I still need the fetch pollyfill

export default React.createClass({

    PropTypes: {
        handleFile: React.PropTypes.func
    },

    getInitialState() {
        return {
            error: ''
        }
    },

    // read in the file, pass details & data along to props.handleFile
    handleFile(e) {
        e.preventDefault();

        this.setState({error: ''});

        const file = e.target.files[0];

        if (!file || !this.props.handleFile) {
            return;
        }

        if (file.size > 1024000) {
            this.setState({error: 'The file size exceeds the limit allowed. The maximum file size is 1 MB.'});
            return;
        }


        const form = new FormData(document.getElementById('fileupload')); // look into using a ref here to allow this form to be duplicated
        fetch('/files', { method: 'POST', body: form })
            .then(res => res.json()) // todo: check res.ok and handle things if it's not
            .then(data => this.props.handleFile(data.id)) // id is the filename on the server
            .catch(err => this.setState({error: err.message || err.toString()}));
    },

    // todo: show an error messages
    // todo: add drag-drop support
    render() {
        return (<div className="_content--upload">
            <form className="upload-form" id="fileupload" method='POST' encType='multipart/form-data' action='/files'>
                <div className="upload--container dropzone">
                    <div className="upload--description">
                        {/*Drag or upload*/} Upload a pdf, Microsoft™ Word(.doc, .docx) or HTML document.
                        (The max file size is 1 MB.)
                    </div>

                    <div className="upload--file-chooser base--label">
                        <label htmlFor="file-chooser-input"
                               className="upload--file-chooser-btn base--button">Choose your file</label>
                        <span className="upload--file-chooser-name"></span>
                        <input id="file-chooser-input" type="file" style={{display: "none"}}
                           accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .html"
                           title="Choose an file to upload" name="document" onChange={this.handleFile} ref="file" />
                    </div>
                </div>
                <div className="error">{this.state.error}</div>
            </form>

            <p className="upload--explanation">
                Attention: IBM collects data from all requests to this demonstration and uses the
                data to improve the services. Do not upload confidential or restricted data.
            </p>
        </div>);
    }
});


