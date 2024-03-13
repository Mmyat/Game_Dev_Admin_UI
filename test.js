import axios from "axios";
const users = [
    {
      key: "1",
      name: "Water Festival Promotion",
      type: "Web",
      prod_patch_id: "1io8734899743.jpg",
      dev_patch_id: "1io8734899743.jpg",
      orientation: "ABCDF",
      status: "production",
    },
    {
      key: "2",
      name: "New Year Promotion",
      type: "cocos",
      prod_patch_id: "1io8734899743.jpg",
      dev_patch_id: "1io8734899743.jpg",
      orientation: "ABCDF",
      status: "development",
    },
    {
      key: "3",
      name: "Valantine's Day Promotion",
      type: "Web",
      prod_patch_id: "1io8734899743.jpg",
      dev_patch_id: "1io8734899743.jpg",
      orientation: "ABCDF",
      status: "production",
    },
    {
      key: "4",
      name: "Thadingyut Promotion",
      type: "cocos",
      prod_patch_id: "1io8734899743.jpg",
      dev_patch_id: "1io8734899743.jpg",
      orientation: "ABCDF",
      status: "production",
    },
  ];
// console.log(users[2]);
const get = async()=>{
  const {data} =await axios.get("http://localhost:3000/login/googleLogin")
  console.log(data);
  return data
}
get();