import React from 'react';
import Image from 'react-bootstrap/lib/Image';
import TangramPlay from './TangramPlay';

function _split (markdown) {
    var sections = markdown.split('[section]');
    let annotatedSections = [];

    // For each [section] in the markdown
    for (let section of sections) {
        section = section.trim();

        // If the section is an image or a tangram play object
        if (section.startsWith('{')) {
            let special = section.replace(/&quot;/g, '"');
            special = JSON.parse(special);

            annotatedSections.push(special);
        }
        // Else if the section is just text
        else {
            annotatedSections.push({
                type: 'text',
                text: section
            });
        }
    }

    return annotatedSections;
}

function _goThroughSections (annotatedSections) {
    let jsx = [];
    let i = 0; // React requires keys for each of the sections we are going to return as an array

    for (let section of annotatedSections) {
        if (section.type === 'text') {
            jsx.push(_textJSX(section, i));
        }
        else if (section.type === 'image') {
            jsx.push(_imageJSX(section, i));
        }
        else if (section.type === 'tangram') {
            jsx.push(_tangramJSX(section, i));
        }
        i = i + 1;
    }

    return jsx;
}

/* Functions to render JSX properly */

function _textJSX (section, i) {
    let textJSX = <div key={i} dangerouslySetInnerHTML={{ __html: section.text }} />;
    return textJSX;
}

let req = require.context('../../Assets/images/', true, /\.(png|gif)$/);

function _imageJSX (section, i) {
    let src = './' + section.src;

    let imageFile;
    req.keys().forEach(function (key) {
        if (key === src) {
            imageFile = req(key);
        }
    });

    let imageJSX = <Image key={i} width={section.width} src={imageFile} responsive />;
    return imageJSX;
}

let tangramplayurl = 'https://precog.mapzen.com/tangrams/tangram-play/tangram-tutorial/?scene=';
let tutorialurl = 'https://tangrams.github.io/tangram-tutorial/src/Assets/tutorial-files/';
let baseurl = tangramplayurl + tutorialurl;

function _tangramJSX (section, i) {
    let url = baseurl + section.src;
    if (section.lines !== undefined) {
        url = url + '&lines=' + section.lines;
    }
    if (section.location !== undefined) {
        url = url + '#' + section.location;
    }

    let tangramJSX = <TangramPlay key={i} url={url} />;
    return tangramJSX;
}

// Will return something like the following which goes within each <Section></Section> component
/* <div dangerouslySetInnerHTML={{ __html: sections[0] }} />
 * <Image width="60%" src={require('../../Assets/images/min.png')} responsive />
 * <div dangerouslySetInnerHTML={{ __html: sections[1] }} />
 */
export default function parseJSX (markdown) {
    let annotatedSections = _split(markdown);
    let result = _goThroughSections(annotatedSections);

    return result;
}