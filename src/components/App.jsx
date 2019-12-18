import React from 'react';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
              <form id="uploadImage" encType="multipart/form-data" action="/api/photo" method="post">
                <input type="file" name="image" />
                <input type="submit" />
              </form>
            </div>
        )
    }
}

export default App;