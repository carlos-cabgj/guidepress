import React from "react";
import { Tree, TreeNode } from 'react-organizational-chart';

export default function PlotTree({ dataToPlot }) {

  const makeTree = () => {
    return printNode(dataToPlot?.modelTree?.model)
  }

  const printNode = (node) => {
    return node?.vals ? 
      node.vals.map((item, index)=>{
      return <TreeNode label={<div>{node?.name} <br></br> {item?.name}</div>}>
          {printNode(item?.child)}
      </TreeNode>})
      :
      (<TreeNode label={<div>{node?.val}</div>}>
      </TreeNode>)
  }

  return (
    <Tree label={<div>Root</div>}>
      {makeTree()}
    </Tree>
  )
}