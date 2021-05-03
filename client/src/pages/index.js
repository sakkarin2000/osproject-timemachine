import React from "react";
import "../App.css";
import { useState } from "react";
import { ProgressBar } from "react-bootstrap";
import Axios from "../axios";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  FormControl,
} from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1, 5),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));
const Home = () => {
  const webDomain="http://10.211.55.3/";
  const [progress, setProgress] = useState();
  const classes = useStyles();
  const [preThumbnail, setPreThumbnail] = useState("");

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setPreThumbnail(process.env.PUBLIC_URL + "/thumbnail_mock.jpg");
    setProgress("0");
    setOpen(true);
  };
  const handleClose = () => {
    setPreThumbnail(process.env.PUBLIC_URL + "/thumbnail_mock.jpg");
    setProgress("0");
    setOpen(false);
  };

  // const displayInfo = () => {
  //   console.log(name + age + country + position + wage);
  // };
  const [employeeList, setEmployeeList] = useState([]);
  const [thumbnailForUpload, setThumbnailForUpload] = useState(new FormData());
  const [videoForUpload, setVideoForUpload] = useState(new FormData());
  const [videoName, setVideoName] = useState("");
  const [description, setDescription] = useState("");
  const [videoList, setVideoList] = useState([]);

  const getVideos = () => {
    Axios.get("/videos").then((response) => {
      console.log(response);
      setVideoList(response.data);
    });
  };

  
  const uploadThumbnail = ({ target: { files } }) => {
    console.log(files[0]);
    let reader = new FileReader();
    reader.onload = function (e) {
      setPreThumbnail(e.target.result);
    };
    reader.readAsDataURL(files[0]);
    const data = new FormData();
    data.append("image", files[0]);
    setThumbnailForUpload(data);
  };
  const uploadVideo = ({ target: { files } }) => {
    console.log(files[0]);
    const data = new FormData();
    data.append("video", files[0]);
    setVideoForUpload(data);
  };
  
  const handleSubmit = () => {
    
    Axios.post("/uploadVideo", videoForUpload, {
      onUploadProgress: (data) => {
        //Set the progress value to show the progress bar
        setProgress(Math.round((100 * data.loaded) / data.total));
      },
    }).then((response2) => {
      console.log(response2.data.path);
      console.log("upload video success");
      Axios.post("/uploadThumbnail", thumbnailForUpload).then((response1) => {
        console.log(response1.data.path);
        console.log("upload thumbnail success");
        Axios.post("/addVideo", {
          videoName: videoName,
          description: description,
          thumbnailPath: response1.data.path,
          videoPath: response2.data.path,
        }).then(() => {
          console.log('Add successfully');
          handleClose();
        });
      });
    });
  };

  return (
    <div className="App">
      <div className="information">
      
        <button className="information" onClick={getVideos}>
          Show Videos
        </button>
        {videoList.map((val, key) => {
          return <div><img src={webDomain+val.thumbnailPath} width="auto" height="150px"></img><br></br>
            {val.id+" "+val.videoName+" "+val.description+" \n"+val.filePath+" \n"+val.publishDateTime+" "+val.editDateTime+" \n"}<br></br></div>;
        })}
      </div>
      <div>
        <Fab
          size="large"
          color="secondary"
          aria-label="add"
          className={classes.margin}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Video</DialogTitle>
          <DialogContent>
            <DialogContentText>Inform your video details</DialogContentText>
            <FormControl>
              <img src={preThumbnail} width="auto" height="200px"></img>
              <Button variant="contained" component="label" color="secondary">
                Upload Video Thumbnail
                <input
                  type="file"
                  hidden
                  onChange={uploadThumbnail}
                  accept="image/*"
                />
              </Button>
              <br></br>
              {progress && (
                <ProgressBar now={progress} label={`${progress}%`} />
              )}
              <Button variant="contained" component="label" color="secondary">
                Upload Video Memory
                <input
                  type="file"
                  hidden
                  onChange={uploadVideo}
                  accept="video/*"
                />
              </Button>
              <TextField
                autoFocus
                margin="dense"
                label="Video Name"
                type="string"
                fullWidth
                onChange={(event) => {
                  setVideoName(event.target.value);
                }}
              />
              <TextField
                autoFocus
                id="standard-multiline-static"
                label="Description"
                multiline
                type="string"
                rows={4}
                fullWidth
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Home;
