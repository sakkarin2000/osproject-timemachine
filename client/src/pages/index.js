import React from "react";
import "../App.css";
import { useState } from "react";
import {ProgressBar} from "react-bootstrap";
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
  const [progress, setProgress] = useState();
  const classes = useStyles();
  const [preThumbnail, setPreThumbnail] = useState("");

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setPreThumbnail(process.env.PUBLIC_URL + "/thumbnail_mock.jpg");
    setProgress('0');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [wage, setWage] = useState(0);
  // const displayInfo = () => {
  //   console.log(name + age + country + position + wage);
  // };
  const [employeeList, setEmployeeList] = useState([]);
  const [thumbnailForUpload, setThumbnailForUpload] = useState(new FormData());
  const [videoForUpload, setVideoForUpload] = useState(new FormData());

  const getEmployee = () => {
    Axios.get("/employees").then((response) => {
      console.log(response);
      setEmployeeList(response.data);
    });
  };

  const addEmployee = () => {
    Axios.post("/create", {
      name: name,
      age: age,
      country: country,
      position: position,
      wage: wage,
    }).then(() => {
      setEmployeeList([
        ...employeeList,
        {
          name: name,
          age: age,
          country: country,
          position: position,
          wage: wage,
        },
      ]);
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

  const handleSubmit = e => {
    e.preventDefault();
    Axios.post("/uploadThumbnail", thumbnailForUpload).then(() => {
      console.log("upload thumbnail success");
    });
    Axios.post("/uploadVideo", videoForUpload,{onUploadProgress: data => {
      //Set the progress value to show the progress bar
      setProgress(Math.round((100 * data.loaded) / data.total))
    },}).then(() => {
      console.log("upload video success");
      handleClose();
    });
    
  };

  return (
    <div className="App">
      <div className="information">
        <label>Name : </label>
        <input
          type="text"
          onChange={(event) => {
            setName(event.target.value);
          }}
        ></input>
        <label>Age: </label>
        <input
          type="number"
          onChange={(event) => {
            setAge(event.target.value);
          }}
        ></input>
        <label>Country : </label>
        <input
          type="text"
          onChange={(event) => {
            setCountry(event.target.value);
          }}
        ></input>
        <label>Position : </label>
        <input
          type="text"
          onChange={(event) => {
            setPosition(event.target.value);
          }}
        ></input>
        <label>Wage (year) : </label>
        <input
          type="number"
          onChange={(event) => {
            setWage(event.target.value);
          }}
        ></input>
        <button onClick={addEmployee}>Submit</button>
        <button className="information" onClick={getEmployee}>
          Show Employees
        </button>
        {employeeList.map((val, key) => {
          return <div>{val.name}</div>;
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
              {progress && <ProgressBar now={progress} label={`${progress}%`} />}
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
              />
              <TextField
                autoFocus
                id="standard-multiline-static"
                label="Description"
                multiline
                type="string"
                rows={4}
                fullWidth
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
