import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
import styled from 'styled-components';
import ReCAPTCHA from 'react-google-recaptcha';
import config from '../config.js';

const Header = styled.div`
  display: flex;
  height: 100px;
  width: 50%;
  margin: auto;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 50px;
  color: #203a46;
  font-weight: bold;
  flex-direction: column;
`;

const OptionContainer = styled.div`
  display: flex;
  height: auto;
  width: 40%;
  margin: auto;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #203a46;
  font-weight: bold;
  flex-direction: row;
  justify-content: center;
`;

const ImageContainer = styled.div`
  display: flex;
  height: auto;
  width: 70%;
  margin: auto;
  flex-flow: row wrap;
  justify-content: center;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #203a46;
  font-weight: bold;
  font-size: 10px;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      images: [],
      captcha: false,
    };
  }

  handleUpload = () => {
    const selected = document.getElementById('filepick').files[0];
    if (!selected) {
      alert('Please select a file');
      this.setState({
        loading: false,
      });
      return;
    }

    if (selected.type !== 'application/pdf') {
      alert("Only PDF's are allowed!");
      this.setState({
        loading: false,
      });
      return;
    }

    const data = new FormData();
    data.append('image', selected);

    const config = {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      },
    };

    const filetype = document.getElementById('filetype').value;
    axios
      .post(`/api/image/${filetype}`, data, config)
      .then(response => {
        const newImages = this.state.images;
        const newImage = [response.data, selected.name.split('.')[0], filetype];
        newImages.push(newImage);
        this.setState({
          loading: false,
          images: newImages,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleCaptcha = value => {
    axios
      .post('/api/verify', {
        value: value,
      })
      .then(response => {
        if (response.data.responseCode === 0) {
          this.setState({
            captcha: true,
          });
        } else {
          this.setState({
            captcha: false,
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          captcha: false,
        });
      });
  };

  convertButton = () => {
    return !this.state.captcha ? (
      <button disabled={true}>Convert</button>
    ) : (
      <button
        onClick={() => {
          this.setState({ loading: true }, this.handleUpload);
        }}
      >
        Convert
      </button>
    );
  };

  render() {
    return (
      <div>
        <Header>
          <center>
            <div>PDF Converter</div>
            <div style={{ fontSize: '20px' }}>Choose a PDF to convert!</div>
          </center>
        </Header>
        <OptionContainer>
          <input id="filepick" type="file" name="image" />
          <select id="filetype">
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="pjpg">PJPG</option>
            <option value="webp">WEBP</option>
            <option value="svg">SVG</option>
          </select>
          {this.convertButton()}
        </OptionContainer>
        <br />
        <center>
          <ReCAPTCHA sitekey={config.cap} onChange={this.handleCaptcha} />
        </center>
        {this.state.loading && (
          <center>
            <img src="./loading.gif"></img>
          </center>
        )}
        <br />
        <ImageContainer>
          {this.state.images.map((image, index) => (
            <div
              key={index}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <img
                style={{
                  height: '400px',
                  width: '300px',
                  border: '1px solid black',
                }}
                src={image[0]}
              ></img>
              <center>{`'${
                image[1]
              }' Converted to ${image[2].toUpperCase()}`}</center>
            </div>
          ))}
        </ImageContainer>
      </div>
    );
  }
}

export default App;
