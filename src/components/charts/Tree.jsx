import React from "react";
import { Tree, TreeNode } from 'react-organizational-chart';

export default function PlotTree({ dataToPlot }) {

  const makeTree = () => {
    return printNode(dataToPlot?.modelTree?.model)
  }

  const printNode = (node, indexParent = 0) => {
    return node?.vals ? 
      node.vals.map((item, index)=>{
      return <TreeNode key={'nodeTree'+indexParent+'-'+index} 
                label={<div>{item?.name}</div>}>
          {printNode(item?.child, indexParent+'-'+index)}
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