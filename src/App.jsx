import React, { useEffect, useState } from "react";
const API = "https://to-dos-api.softclub.tj/api/to-dos";
import axios from "axios";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const App = () => {
  const [data, setData] = useState([]);
  const [search , setSearch] = useState('')
  const [editName , setEditName] = useState('')
  const [editDesc , setEditDesc] = useState('')
  const [idx , setIdx] = useState(null)
  async function get() {
    try {
      const { data } = await axios.get(API);
      setData(data.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    get();
  }, []);

  async function funDel(id) {
    try {
      await axios.delete(`${API}?id=${id}`);
      get();
    } catch (error) {
      console.error(error);
    }
  }
  function handleClick() {
    if (localStorage.theme === "dark" || !("theme" in localStorage)) {
      //add class=dark in html element
      document.documentElement.classList.add("dark");
    } else {
      //remove class=dark in html element
      document.documentElement.classList.remove("dark");
    }

    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
    } else {
      localStorage.theme = "dark";
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formdata = new FormData();
    let images = e.target["Images"].files;
    for (let i = 0; i < images.length; i++) {
      formdata.append("Images", images[i]);
    }
    formdata.append("Name", e.target["Name"].value);
    formdata.append("Description", e.target["Description"].value);
    try {
      await axios.post(API, formdata);
      get();
      e.target.reset();
    } catch (error) {
      console.error(error);
    }
  };
  async function editFun() {
    const newUser = {
      name : editName , 
      description : editDesc ,
      id : idx
    }
    try {
      await axios.put(API , newUser)
      get()
      setEditDesc('')
      setEditName('')
      setIdx(null)
    } catch (error) {
      console.error(error);
    }
  }
  const filter = data.filter((e)=> {
    let ele = {}
    if(search){
      ele = search.toUpperCase().includes(e.name.toUpperCase())
    }
    return ele
  })
  return (
    <div className="max-w-[1900px] m-auto relative p-5">
      <Dialog>
        <DialogTrigger className='bg-blue-600 py-1.5 px-2 text-white font-bold rounded-[5px] w-[70px]'>+ NEW</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ADD USER</DialogTitle>
            <DialogDescription>
              <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
                <input className="border-1 py-1.5 px-2 rounded-2xl" name="Images" type="file" multiple />
                <input className="border-1 py-1.5 px-2 rounded-2xl" name="Name" type="text" placeholder="Add name" />
                <input className="border-1 py-1.5 px-2 rounded-2xl"
                  name="Description"
                  type="text"
                  placeholder="Add City"
                />
                <button type="submit" className="font-bold text-[20px]">save</button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <input type="text" className="border-1 mx-5 py-1 px-2 md:w-[300px]" value={search} onChange={(e)=> setSearch(e.target.value)} placeholder="Search User" />
      <button onClick={handleClick} className='bg-blue-600 py-1.5 px-2 text-white font-bold rounded-[5px] w-[70px] absolute right-[50px]'>Dark</button>
      <Table className="w-[1800px] m-auto mt-10">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="">
          <TableRow>
            <TableHead className="w-[340px]">Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Phone</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filter.map((e) => {
            return (
              <TableRow className="">
                <TableCell className="font-medium flex items-center gap-2.5">
                  {e.images.map((el) => {
                    return (
                      <img
                        className="w-[50px] h-[50px] rounded-4xl"
                        src={`https://to-dos-api.softclub.tj/images/${el.imageName}`}
                        alt=""
                      />
                    );
                  })}
                  <div>
                    {e.name}
                    <p className="text-gray-500">jessica.hanson@example.com</p>
                  </div>
                </TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell className="w-[200px]">
                  {e.isCompleted ? (
                    <div className="w-[75px] bg-green-600 text-white py-1.5 px-2">
                      ACTIVE
                    </div>
                  ) : (
                    <div className="w-[75px] bg-[#748998] text-white py-1.5 px-2">
                      INACTIVE
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right text-[20px]">
                  88888 0090
                </TableCell>
                <TableCell className="text-right text-[20px]">
                  <Popover className="">
                    <PopoverTrigger className="text-[40px]">...</PopoverTrigger>
                    <PopoverContent className="flex flex-col items-start gap-3">
                      {/* ///////////////////////////// open Shit */}
                      <Sheet>
                        <SheetTrigger className="text-[17px] font-bold px-4">
                          View Profile
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>User Info</SheetTitle>
                            <SheetDescription className="text-center">
                              <hr />
                              {e.images.map((el) => {
                                return (
                                  <img
                                    className="w-[200px] h-[200px] rounded-[50%] m-auto mt-7"
                                    src={`https://to-dos-api.softclub.tj/images/${el.imageName}`}
                                    alt=""
                                  />
                                );
                              })}
                              <h1 className="text-black text-3xl">{e.name}</h1>
                              <p className="text-[20px] my-2.5">
                                jessica.hanson@example.com
                              </p>
                              <hr />
                            </SheetDescription>
                          </SheetHeader>
                        </SheetContent>
                      </Sheet>
                      <Dialog>
                        <DialogTrigger className="text-[17px] px-4 font-bold" onClick={()=> {
                          setEditName(e.name)
                          setEditDesc(e.description)
                          setIdx(e.id)
                          }}>
                          Edit
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription className='flex flex-col gap-2'>
                              <input type="text" className="border-1 py-1.5 px-2 rounded-2xl" value={editName} onChange={(e)=> setEditName(e.target.value)} placeholder="Edit Name" />
                              <input type="text" className="border-1 py-1.5 px-2 rounded-2xl" value={editDesc} onChange={(e)=> setEditDesc(e.target.value)} placeholder="Edit City" />
                              <button className="font-bold text-[20px]" onClick={editFun}>Save Edit</button>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      {/* ///////////////////////////////////////////////// btn DELETE*/}
                      <Button
                        variant="outline"
                        className="bg-transparent border-none shadow-none text-red-600 text-[16px]"
                        onClick={() => funDel(e.id)}
                      >
                        DELETE
                      </Button>
                      {/* //////////////////////////////////////////////// modalka */}
                      {/* //////////////////////////////////////////// */}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default App;
