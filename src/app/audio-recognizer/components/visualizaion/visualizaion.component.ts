import { Component, OnInit , Input, ViewChild, ElementRef, SimpleChanges, SimpleChange, AfterViewInit} from '@angular/core';
import * as d3 from 'd3';


var drawVisual;
const TOTAL_BAR : number = 32;

@Component({
  selector: 'app-visualizaion',
  templateUrl: './visualizaion.component.html',
  styleUrls: ['./visualizaion.component.scss'],
  providers: []

})
export class VisualizaionComponent implements OnInit {

  @Input()
  containerWidth: number;

  @Input()
  containerHeight: number;

  @ViewChild('ngAnimationContainer', {static: true}) ngAnimationContainer:ElementRef; 

  collectData: boolean = false;
  analyser: AnalyserNode;
  source: MediaStreamAudioSourceNode;
  stream: MediaStream;
  navigator: Navigator;
  audioContext: AudioContext;
  baseLatency: any;
  mediaDevices: MediaDevices;

  svg: d3.Selection<any>;
  width: number;
  public height: number;

  constructor() { }

  ngOnInit(): void {
    this.navigator = navigator;
    this.height = this.containerHeight;
    this.switchVisualization();
  }
 

 
  switchVisualization() {
    this.interruptAnimation();
    this.resetSvg();
    this.prepAnimationCanvas();
    this.prepVisualization2();
  }

  resetSvg() {
    d3.select('svg').remove();
  }

  getHeight() {
    return this.containerHeight;
  }

  getWidth() {
    return this.containerWidth;
  }

  testDimensions() {

  }


  interruptAnimation() {
    window.cancelAnimationFrame(drawVisual);
    // this.ngAnimationContainer.nativeElement.cancelAnimationFrame(drawVisual);
  }


   prepVisualization2() {
    this.getSoundCardData();
    let barWidth = (this.containerWidth - (TOTAL_BAR * 5)) / TOTAL_BAR;
    let barHeight = this.containerHeight * 0.1;
    for (let i = 0; i < TOTAL_BAR; i++) {
      this.appendRect(this.svg, 'rect-' + i, barHeight, barWidth, "#44CF6C", "#44CF6C", 1, (barWidth * i) + (5 * i), (this.containerHeight) - (barHeight / 2));
    } 
  }

  prepAnimationCanvas() {
    this.svg = d3.select(this.ngAnimationContainer.nativeElement).append('svg')
      .attr('width', this.containerWidth)
      .attr('height', this.containerHeight)
      .attr('id', 'svg-container')
      .append('g');
  }

  appendRect(svg: d3.Selection<any>, id: string, h: number, w: number, strokeColor: string, fillColor: string, strokeWidth: number, trans_x: number, trans_y: number) {
    svg.append('rect')
      .attr('class', 'reactive-rect')
      .attr('id', id)
      .attr('width', w)
      .attr('height', h)
      .attr('fill', fillColor)
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth + "px")
      .attr('transform', 'translate(' + trans_x + ',' + trans_y + ')');
  }

  getSoundCardData() {
    if (this.navigator.mediaDevices.getUserMedia) {
      this.navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        let audioContext = new AudioContext();
        let analyser = audioContext.createAnalyser();
        let source: MediaStreamAudioSourceNode;
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        let parentClass = new VisualizaionComponent();
        parentClass.visualize(source, stream, analyser);
      });
    }
  }


   visualize(source, stream, analyser) {
     
    analyser.fftSize = 256;
    let bufferLength = analyser.fftSize;
    let dataArray = new Uint8Array(bufferLength);
   
  
    let containerHeight = d3.select('svg').attr('height');
    let containerWidth = d3.select('svg').attr('width');
    var max = 1.0;
    var min = -1.0;


    let draw2 = function () {
      drawVisual = requestAnimationFrame(draw2);
      analyser.getByteFrequencyData(dataArray);
      let baseHeight = containerHeight * 0.1;
      let barWidth = (containerWidth - (TOTAL_BAR * 5)) / TOTAL_BAR;
  

      for (let i = 0; i < TOTAL_BAR; i++) {
       
        let newColor = 'rgba(' + 255 + ',' + 255+ ',' + 255 + ')';
        let newHeight = baseHeight + ((containerHeight * 0.9) * (dataArray[i] / 256));
      
        d3.select("#rect-" + i)
          .attr('stroke', newColor)
          .attr('fill', newColor)
          .attr('height', newHeight/2)
          .attr('transform', 'translate(' + ((barWidth * i) + (5 * i)) + ',' + ((containerHeight ) - (newHeight / 2)) + ')');
      }
    }
    draw2();
  }

}
