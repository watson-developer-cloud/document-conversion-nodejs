import React from 'react';
import {Icon, RadioGroup, Radio, Tabs, Pane } from 'watson-react-components';
import UploadForm from './upload-form.jsx'

import PDF from './pdf.jsx'
import Word from './word.jsx'
import HTML from './html.jsx'

import Output from './output.jsx'

const renders = {
    'html': HTML,
    'pdf': PDF,
    'doc': Word,
    'docx': Word,
    'default': function() {return (<span>Unrecognized file type. Please ensure file has the correct extension.</span>);}
};

const SOURCE_UPLOAD = 'custom';


export default React.createClass({

    getInitialState() {
        return {
            source: '', // usually the filename, but may be SOURCE_UPLOAD
            destination: null, // output format
            file: '' // the filename to use when source is SOURCE_UPLOAD
        };
    },

    // if source is upload, then get the filename from that, otherwise, the source is the filename
    getFilename() {
        // todo: see if we can make this a getter - I was getting a this.state is undefined error :/
        return this.state.source === SOURCE_UPLOAD ? this.state.file : this.state.source;
    },

    handleSource(source) {
        this.setState({source, output: ''});
    },

    handleDestination(destination) {
        this.setState({destination, output: ''});
    },

    handleFile(file) {
        this.setState({file, output: ''});
    },

    // todo: use classes instead of setting style to show/hide things, consider adding transitions
    render() {
        const url = `/files/${this.getFilename()}?download=true`;

        const Renderer = renders[this.getFilename().split('.').pop()] || renders['default'];

        return (
            <div className="_container _container_large">
                <div className="row">
                    <div className="_content--choose-input-file">
                        <h2 id="upload-your-document" className="base--h2">Upload your document</h2>
                        <p className="_content--input-description base--p">
                            This demo allows you to try out the Document Conversion service on a single file.
                        </p>

                        <RadioGroup name="source" className="radio-group" onChange={this.handleSource} value={this.state.source} tabStyle={true}>
                            <Radio value="sampleHTML.html">
                                <img src="/images/icons/html_icon.svg" alt=""/>
                                Sample.html
                            </Radio>
                            <Radio value="sampleWORD.docx">
                                <img src="/images/icons/doc_icon.svg" alt=""/>
                                Sample.docx
                            </Radio>
                            <Radio value="samplePDF.pdf">
                                <img src="/images/icons/pdf_icon.svg" alt=""/>
                                Sample.pdf
                            </Radio>
                            <Radio value={SOURCE_UPLOAD}>
                                <img src="/images/icons/upload_icon.svg" alt=""/>
                                Upload a file
                            </Radio>
                        </RadioGroup>

                        {this.state.source === 'custom' ? <UploadForm handleFile={this.handleFile} /> : null }

                    </div>

                    <div className="_content--choose-output-format" style={{display: this.getFilename() ? 'block' : 'none'}}>
                        <h2 id="choose-output-format" className="base--h2">Choose an output format</h2>

                        <div className="_content--format">
                            <RadioGroup name="destination" className="radio-group" onChange={this.handleDestination} value={this.props.destination} tabStyle={true}>
                                <Radio value="json">Answer units JSON</Radio>
                                <Radio value="html">Normalized HTML</Radio>
                                <Radio value="text">Plain text</Radio>
                            </RadioGroup>
                        </div>
                    </div>

                    <div className="_content--output" style={{display: this.getFilename() && this.state.destination ? 'block' : 'none'}}>
                        <p className="base--p description--answer-unit" style={{display: this.state.destination === 'ANSWER_UNITS' ? 'block' : 'none'}}>
                        The Answer units JSON can be use to train the Retrieve and Rank service.
                        </p>

                        <Tabs selected={1}>
                            <Pane label="Your document">
                                <div>
                                    <Renderer url={url} />
                                    <a className="base--a" title="Download input document" href={url}>Download</a>
                                </div>
                            </Pane>
                            <Pane label="Output document">
                                <Output id={this.getFilename()} format={this.state.destination}/>
                            </Pane>
                        </Tabs>


                    </div>

                </div>
            </div>
        );
    }
});
