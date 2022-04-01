import React from "react";

import {
  Grid
} from "@material-ui/core";

import PlotByWeek from '../charts/ByWeek';
import PlotDataHours from '../charts/DataHours';
import PlotTfIdfByAll from '../charts/TfIdfByAll';
import PlotPostTime from '../charts/PostTime';
import PlotComparison from '../charts/Comparison';
import PlotTree from '../charts/Tree';

import Typography from "@material-ui/core/Typography";

export default function ResultsPanel({ 
  results,
}) {

  return (
    <div>
      <div id="linear">
        <div className="chart"></div>
        <div className="status"></div>
        <div id="modelInspectionOutput">
          <p id="inspectionHeadline"></p>
          <table id="myTable"></table>
        </div>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          Quantas palavras geradas : {results?.countWordsGenerated}
          <br />
          Quantas palavras apresentadas : {results?.countWordsUsed}
          <br />
          Quantos documentos analisados : {results?.countDocuments}
          <br />
          Quantas fontes analisadas : {results?.countFonts}
          <br />
          Quantos termos únicos usados na árvore : {results?.countWordsUsedTree}
        </Grid>
        <Grid item xs={12} style={{overflow:'auto'}}>
          <Typography variant="h6" gutterBottom>
            Árvore 1
          </Typography>
          <PlotTree dataToPlot={results?.modelTree} />
        </Grid>

        <Grid item xs={12} style={{overflow:'auto'}}>
          <Typography variant="h6" gutterBottom>
            Árvore 2
          </Typography>
          <PlotTree dataToPlot={results?.modelTree2} />
        </Grid>

        <Grid item xs={12}>
          <PlotComparison similarityList={results?.similarityList} />
        </Grid>
        <Grid item xs={12}>
          <PlotPostTime plotDataPosttTime={results?.plotDataPostTime} />
        </Grid>
        <Grid item xs={12}>
          <PlotTfIdfByAll plotDataAll={results?.plotDataAll} />
        </Grid>
        <Grid item xs={12}>
          <PlotByWeek plotDataWeek={results?.plotDataWeek} />
        </Grid>
        <Grid item xs={12}>
          <PlotDataHours plotDataHours={results?.plotDataHours} />
        </Grid>
      </Grid>
    </div>
  )
}