import React from "react";
import { Tree, TreeNode } from 'react-organizational-chart';

export default function PlotTree({ dataToPlot }) {

  console.log(1)
  const makeTree = () => {
    // let dataToPlot = {modelTree : calcDataTree_default_simple()};
    // let dataToPlot = {modelTree : calcDataTree_default_double()};
    // let dataToPlot = {modelTree : calcDataTree_default_string()};

    return printNode(dataToPlot?.modelTree?.model)
  }

  const printNode = (node, indexParent = 0) => {

    return node?.vals ? 
      node.vals.map(
        (item, index)=>{
          return  item?.name ? <TreeNode 
            key={'nodeTree'+indexParent+'-'+index} 
            label={<div>{item?.name}</div>}>
              {printNode(item?.child, indexParent+'-'+index)}
          </TreeNode>
          :
            printNode(item?.child, indexParent+'-'+index)
        })
      :
      ( typeof node?.val !=  'boolean' ?
          <TreeNode 
            key={'nodeTree'+indexParent+'--'}
            label={<div>{node?.val}</div>}>
          </TreeNode>
          :
          <></>
      )
  }

  return (
    <Tree label={<div>Root</div>}>
      {makeTree()}
    </Tree>
  )
}