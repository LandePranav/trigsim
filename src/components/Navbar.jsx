import { useContext, useState } from "react";
import { useThree } from "@react-three/fiber";
import ZoomControls from "./ZoomControls";
import { MantineProvider, Tooltip, Button } from "@mantine/core";

export default function Navbar({ handleReset, zoomIn, zoomOut, isDrawing, setIsDrawing }) {

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS withCssVariables withGlobalClasses >
      <div className="absolute w-full mt-2 z-50">
        <div className=" w-2/3 mx-auto  bg-gray-300 bg-opacity-25 rounded-xl p-1 border-2 border-gray-600">
          <div className="w-full flex items-center justify-around">
            <Tooltip multiline offset={15} zIndex={50} width={100} withArrow className="absolute z-50 " label="drag building (under dev)">
              <button type="button" className="border-2 w-full border-transparent mx-3 my-1 flex justify-center items-center  py-1 rounded-2xl hover:bg-gray-200 hover:border-2 hover:border-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </button>
            </Tooltip>

            <Tooltip label="zoom in" className="absolute text-white bg-black bg-opacity-75 px-1.5 rounded-md" offset={15} >
              <button onClick={() => zoomIn.current()} type="button" className="border-2 w-full border-transparent mx-3 my-1 flex justify-center items-center  py-1 rounded-2xl hover:bg-gray-200 hover:border-2 hover:border-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                </svg>
              </button>
            </Tooltip>

            <Tooltip label="zoom out" className="absolute text-white bg-black bg-opacity-75 px-1.5 rounded-md" offset={15}>
              <button onClick={() => zoomOut.current()} type="button" className="border-2 w-full border-transparent mx-3 my-1 flex justify-center items-center  py-1 rounded-2xl hover:bg-gray-200 hover:border-2 hover:border-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
                </svg>
              </button>
            </Tooltip>

            <button type="button" className="border-2 w-full border-transparent mx-3 my-1 flex justify-center items-center  py-1 rounded-2xl hover:bg-gray-200 hover:border-2 hover:border-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
              </svg>
            </button>

            <button onClick={() => setIsDrawing(!isDrawing)} type="button" className="border-2 w-full border-transparent mx-3 my-1 flex justify-center items-center  py-1 rounded-2xl hover:bg-gray-200 hover:border-2 hover:border-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </button>

            <button type="button" className="border-2 w-full border-transparent mx-3 my-1 flex justify-center items-center  py-1 rounded-2xl hover:bg-gray-200 hover:border-2 hover:border-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
              </svg>
            </button>

            <Tooltip label="Reset all" className="absolute text-white bg-black bg-opacity-75 px-1.5 rounded-md" offset={15}>
              <button
                onClick={handleReset}
                type="button"
                className="border-2 w-full border-transparent mx-3 my-1 flex justify-center items-center  py-1 rounded-2xl hover:bg-gray-200 hover:border-2 hover:border-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </Tooltip>

            <button type="button" className="border-2 w-full border-transparent mx-3 my-1 flex justify-center items-center  py-1 rounded-2xl hover:bg-gray-200 hover:border-2 hover:border-black">
              File
            </button>

          </div>

        </div>
      </div>
    </MantineProvider>

  );
}