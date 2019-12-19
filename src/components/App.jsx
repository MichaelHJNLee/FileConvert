import React from 'react';
import axios from 'axios';
import FormData from 'form-data';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          images: []
        }
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload() {
      let selected = document.getElementById('filepick').files[0];
      if (!selected) {
        alert("Please select a file");
        return;
      }
      if (selected.type !== "application/pdf") {
        alert("Only PDF's are allowed!");
        return;
      }
      let data = new FormData();
      data.append("image", selected);
      let config = {
        headers: { 'Content-Type': `multipart/form-data; boundary=${data._boundary}` },
      }
      axios.post(`/api/image/${document.getElementById('filetype').value}`, data, config)
        .then((response) => {
          let newImages = this.state.images;
          newImages.push(response.data);
          this.setState({
            images: newImages
          })
        })
        .catch((err) => {
          console.log(err);
        })
    }


    render() {
        return (
            <div>
              <input id="filepick" type="file" name="image" />
              <select id="filetype">
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
                <option value="pjpg">PJPG</option>
                <option value="webp">WEBP</option>
                <option value="svg">SVG</option>
              </select>
              <button onClick={this.handleUpload}>Submit</button>
              <div>{this.state.images.map((image, index) => <img key={index} src={image}></img>)}</div>
            </div>
        )
    }
}

export default App;