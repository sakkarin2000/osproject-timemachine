import React, { useEffect } from "react";
import "../App.css";
import { useState } from "react";
import { ProgressBar } from "react-bootstrap";
import Axios from "../axios";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import CardContent from "@material-ui/core/CardContent";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VideoPlayer from 'react-video-js-player';
import {
  Button,
  TextField,
  Dialog,
  IconButton,
  DialogActions,
  Typography,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  FormControl,
  Card,
  CardHeader,
  Grid,
} from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
  margin: {
    margin: theme.spacing(5, 2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  //------
  root: {
    maxWidth: 450,
    minWidth: 450,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
}));
const Home = () => {
  const webDomain = "http://10.211.55.3/";
  const [progress, setProgress] = useState();
  const classes = useStyles();
  const [preThumbnail, setPreThumbnail] = useState("");

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [selectedVideoId, setSelectedVideoId] = React.useState(-1);
  const [deleteVideoId, setDeleteVideoId] = React.useState(-1);
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
  const handleDeleteOpen = (id) => {
    setDeleteVideoId(id);
    setOpen3(true);
  };
  const handleDeleteClose = () => {
    setDeleteVideoId(-1);
    setOpen3(false);
  };

  function handleEditOpen(val) {
    setVideoName(val.videoName);
    setDescription(val.description);
    setSelectedVideoId(val.id);
    setOpen2(true);
  }

  const handleEditClose = () => {
    setVideoName("");
    setDescription("");
    setSelectedVideoId(-1);
    setOpen2(false);
  };

  function Video(data, key) {
    var publishDate = "" + new Date(data.publishDateTime);
    return (
      
      <Grid item xs={6} style={{marginRight:"-120px", marginLeft:"120px"}}>
      <Card className={classes.root}>
        <CardHeader
          title={data.videoName}
          subheader={publishDate.substring(0, 25)}
          action={
            <div>
              <div
                style={{
                  position: "absolute",
                  marginTop: "10px",
                  marginLeft: "-50px",
                }}
              >
                <IconButton
                  onClick={() => {
                    handleDeleteOpen(data.id);
                  }}
                  aria-label="delete"
                  style={{ width: 40, height: 40 }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              <div
                style={{
                  position: "absolute",
                  marginTop: "10px",
                  marginLeft: "-100px",
                }}
              >
                <IconButton
                  onClick={() => {
                    handleEditOpen({
                      videoName: data.videoName,
                      description: data.description,
                      id: data.id,
                    });
                  }}
                  aria-label="delete"
                  style={{ width: 40, height: 40 }}
                >
                  <EditIcon />
                </IconButton>
              </div>
            </div>
          }
        />
        
        <div
                style={{
                  position: "absolute",
                  marginTop: "70px",
                  marginLeft: "170px",
                }}
              >
                <IconButton
                  onClick={() => {
                    
                  }}
                  aria-label="delete"
                  
                  style={{ width: 100, height: 100 }}
                >
                  <PlayArrowIcon style={{fontSize:80}} />
                </IconButton>
              </div>
        <VideoPlayer src={webDomain+data.filePath} poster={webDomain+data.thumbnailPath} width="450px" height="auto"/>
        {/* <CardMedia
          className={classes.media}
          video={webDomain + data.filePath}
          width="auto"
          height="200px"
          title="Paella dish"
          
        /> */}
        
        <CardContent>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            align="justify"
          >
            {data.description}
          </Typography>
        </CardContent>
      </Card>
      </Grid>
    );
  }

  const [thumbnailForUpload, setThumbnailForUpload] = useState(new FormData());
  const [videoForUpload, setVideoForUpload] = useState(new FormData());
  const [videoName, setVideoName] = useState("");
  const [description, setDescription] = useState("");
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    Axios.get("/videos").then((response) => {
      console.log(response);
      setVideoList(response.data);
    });
  }, []);

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
  const updateVideo = () => {
    console.log(videoName + " " + description + " " + selectedVideoId);
    Axios.put("http://10.211.55.3:3001/update", {
      videoName: videoName,
      description: description,
      id: selectedVideoId,
    }).then((response) => {
      
      setVideoList(
        videoList.map((val) => {
          return val.id===selectedVideoId? {id: val.id, videoName: videoName, description:description,editDateTime:val.editDateTime,filePath:val.filePath,publishDateTime:val.publishDateTime ,thumbnailPath:val.thumbnailPath}:val
        })
      );
      handleEditClose();
    });
  };
  const deleteVideo = (id) => {
    Axios.delete(`http://10.211.55.3:3001/delete/${id}`).then((response) => {
      setVideoList(
        videoList.filter((val) => {
          return val.id !== id;
        })
      );
      handleDeleteClose();
    });
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
          console.log("Add successfully");
          handleClose();
          window.location.reload();
        });
      });
    });
  };

  return (
    <div className="App">
      
      <div className="information">
        <Fab
          size="large"
          color="secondary"
          aria-label="add"
          className={classes.margin}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
      <Grid container spacing={3}>
        {videoList.slice(0).reverse().map((val, key) => {
          return Video(val, key);
        })}
        </Grid>
      </div>
      <div>
        
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Video</DialogTitle>
          <DialogContent>
            <DialogContentText>Inform your video details</DialogContentText>
            <FormControl>
              <img alt="" src={preThumbnail} width="auto" height="200px"></img>
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

        <Dialog
          open={open2}
          onClose={handleEditClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Update Video Details</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit your video details</DialogContentText>
            <FormControl fullWidth>
              <TextField
                autoFocus
                margin="dense"
                label="Video Name"
                type="string"
                value={videoName}
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
                value={description}
                rows={4}
                fullWidth
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              Cancel
            </Button>
            <Button onClick={updateVideo} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={open3}
          onClose={handleDeleteOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you confirm to delete?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Warning! Your memory will not be back again...
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteVideo(deleteVideoId);
              }}
              color="secondary"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Home;
