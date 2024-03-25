import axios from "axios";
const id=49
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJNeW8gTXlhdCBaYXciLCJlbWFpbCI6Im1teWF0aGFoYUBnbWFpbC5jb20iLCJpZCI6IjEwNjc0NDk2OTUzNjAwNDk0MTgwMiJ9LCJpYXQiOjE3MTEwOTczNDUsImV4cCI6MTcxMTEwMDk0NX0.mGn8PFuYP_wae8OmW0ClX1AXFcpHwGlldABtIyyMf9s"
const response = await axios.get(
  `http://localhost:3000/bundle/detailBundle/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
console.log(response.data);
