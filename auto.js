/**
 * autorowtootch
 * @author zlb
 * @date 2021-2-24
 */
var autorowtootch = {
	inject: ['planPt'],
	mixins: [baseygMixin, planParent, dataBase],
	provide() {
		return {
			father: this,
			appRoot: this.planPt
		};
	},
	template: `
        <div class="auto-row-tooth"><!--分窗区分竖线-->
            <span :style="linestyle()" v-show="viewcontrastv"></span>
            <!--排牙弹框-->
            <rowteeth-dialog
                ref="rowteethgoon"
                @closeBtn="closeBtn"
                @onCancel="onCancel"
                :showdailog="showdailog"
                :aftertwoview="aftertwoview"
                :viewcontrastv="viewcontrastv"
                :shapeconfig="shapeconfig"
                :teethconfig="teethconfig"
                :sliceconfig="sliceconfig"
                :ids="ids"
                :fixids="fixids"
                @hasipr="hasipr"
                @unableClose="unableClose">
            </rowteeth-dialog>

            <!--提示信息弹框-->
            <yg-dialog :cnf="coordErrorNum" class="rowteethdialog">
                <div slot="body" class="myform" style="text-align:center;line-height:135px">
                    <img src="/pstatic/img/Warning.png">
                    <span style="margin-left:10px">{{$t('smallTeethTips')}}</span>
                </div>

                <div slot="foot" style="text-align:center;">
                    <yg-button type="default" @click="closeBtn('coordError')" v-text="$t('closeBtn')"></yg-button>
                </div>
            </yg-dialog>
            <!--提示信息弹框-->
            <yg-dialog :cnf="diaSameToothNum" class="rowteethdialog">
                <div slot="body" class="myform" style="text-align:center;line-height:135px">
                    <img src="/pstatic/img/Warning.png">
                    {{$t('sameTeethTips')}}
                </div>

                <div slot="foot" style="text-align:center;">
                    <yg-button type="default" @click="closeBtn('sameId')" v-text="$t('closeBtn')"></yg-button>
                </div>
            </yg-dialog>

            <!--提示信息弹框-->
            <yg-dialog :cnf="diaToothIdComplete" class="rowteethdialog">
                <div slot="body" class="myform" style="text-align:center;line-height:135px">
                    <img src="/pstatic/img/Warning.png">
                        {{$t('missToothTips')}}
                </div>

                <div slot="foot" style="text-align:center;">
                    <yg-button type="default" @click="closeBtn('idcomplete')" v-text="$t('closeBtn')"></yg-button>
                </div>
            </yg-dialog>

            <!--提示信息弹框-->
            <yg-dialog :cnf="diaNoOperationAxis" class="rowteethdialog">
                <div slot="body" class="myform" style="text-align:center;line-height:135px">
                    <img src="/pstatic/img/Warning.png">
                        {{$('adjustLastFrame')}}
                </div>

                <div slot="foot" style="text-align:center;">
                    <yg-button type="default" @click="closeBtn('NoOperationAxis')" v-text="$t('closeBtn')"></yg-button>
                </div>
            </yg-dialog>

            <!--拔牙过多提示-->
            <yg-dialog :cnf="removeTooMany" class="rowteethdialog">
                <div slot="body" class="myform" style="display:flex;height:100%;align-items:center;padding:0 10px">
                    <img src="/pstatic/img/Warning.png">
                    <span style="margin-left:10px">{{$t('greaterThanEqualTo12')}}</span>
                </div>

                <div slot="foot" style="text-align:center;">
                    <yg-button type="default" @click="closeBtn('goOnRow')" v-text="$t('okBtnTxt')"></yg-button>
                    <yg-button type="default" @click="closeBtn('overRemove')" v-text="$t('cnBtnTxt')"></yg-button>
                </div>
            </yg-dialog>

            <div class="topleftTool" v-show="!viewcontrastv && !teethposcom">
                <!--上一步 下一步-->
                <div class="stepBtns">
                    <div :class="[{'touch-defaultback':touchDefaultback,'stepdisableBcak':backstepdisable},stepsBtnDate[0].class]" v-show="stepOrUndo=='step' && planahistory !=1" @click="backstep"
                    @mouseenter="onstepenter($event,'backstep')"
                    @touchstart="onsteptouchstart($event,'backstep')" @touchend="onsteptouchend($event,'backstep')">
                        <i class="iconfont icon-zuojiantou1"></i>
                        <span>{{$t('previousstep')}}</span>
                    </div>
                    <div :class="[{'touch-defaultnext':touchDefaultnext,'stepdisableNext':nextstepdisable,},stepsBtnDate[1].class]" v-show="stepOrUndo=='step' && planahistory !=1" @click="nextstep"
                    @mouseenter="onstepenter($event,'nextstep')"
                    @touchstart="onsteptouchstart($event,'nextstep')" @touchend="onsteptouchend($event,'nextstep')">
<!--                        <span style="display:inline-block;height:16px">-->
<!--                            <img src="/swan/static/img/autorowtooth/pubimg/nextstep.png">-->
<!--                        </span>-->
                        <i class="iconfont icon-zuojiantou1" style="transform-style: preserve-3d;transform: rotateY(180deg);"></i>
                        <span>{{$t('nextstep')}}</span>
                    </div>
                </div>
                <!--咬合平面 和 中心线平面 的按钮-->
                <div class="adjust_tool" v-show="curstep == 0 && stepOrUndo=='step' && planahistory !=1" style="z-index:11">
                    <div class="adjust_tool_title">{{$t('tool')}}</div>
                        <div :title="$t('jawplane')" :class="['adjust_tool_img_small',{'adjust_tool_img_small_active': (showpA==1&&sacoType!=1), 'adjust_tool_img_small_leave': (sacoType!=0)}]" @click="lefttool('oc')" style="float:left;margin-right:5px;margin-left:10px" @mouseenter="ocsaenter('oc')" @mouseleave="ocsaleave('oc')" ref="ocRef">
                        <!--颌平面-->
                            <img :src="(showpA==1&&sacoType!=1) ? ocSrcCheck : ocSrc" :alt="$t('jawplane')">
                        </div>
                        <div :title="$t('centerline')" :class="['adjust_tool_img_small',{'adjust_tool_img_small_active':(showpA==1&&sacoType==1), 'adjust_tool_img_small_leave':(sacoType!=1)}]" @click="lefttool('sa')" style="float:left;margin-right:10px;margin-left:5px" @mouseenter="ocsaenter('sa')" @mouseleave="ocsaleave('sa')"  ref="saRef">
                        <!--中线-->
                            <img :src="(showpA==1&&sacoType==1) ? saSrcCheck : saSrc" :alt="$t('centerline')">
                        </div>
                </div>

                <div class="bx-sz "  >
                   <!-- 手动标定 v-if="curstep == 1"  -->
                   <div v-if="curstep == 1 || curstep == 3" class="mb-10 bg-fff bdr-3 mt-10" style="position:relative">
                     <div class="b-fot h-30 lh-30 p-l10 p-r10 c-6 fz-12 display" style=" justify-content: space-between;">
                        <div>{{ $t('manualCalibration') }}</div>
                        <div :class="['icon1', 'cursor',smstate ? 'acTishi': '']" @click="shuoMing"></div>
                     </div>
                     <div class="h-60 lh-60" style="overflow:hidden">
                        <div v-if="bdstate==true" :title="$t('calibration')" @click="bdStateClick" class="h-40 lh-40 ml-10 cursor py date2016_action" style="width: 0.30rem;margin-top:0.10rem;" v-on:mouseover="sdChangeActive('20')" v-on:mouseout="outsdChangeActive(1)">
                          <img :src="SdhouseActive=='20'?activeSd:defaultSd" style="width: 0.30rem;height:0.30rem;"/>
                       </div>
                       <div v-else style="display:flex;" @click="bdStateClick">
                         <div class="bding h-40  lh-40 display mt-10 ml-10 cursor" :title="$t('calibration')" >
                             <img src="/swan/static/img/common/lefticon/biaodingnew.png?ver=6?var=1" style="width: 0.30rem;height:0.30rem;"/>
                         </div>
                      </div>
                  </div>
                  <transition name="fade">
                      <div  v-show="smstate" style="width:1.90rem; position:absolute;top:0.00rem;left:190px" class="bg-fff">
                       <div><img src="/swan/static/img/common/helppic.png?ver=6?var=1016" style="width:100%" /></div>
                        <div class="p-l10 p-t10 c-6 p-b10">{{ $t('calibrationExplain') }}</div>
                   </div>
                   </transition>
                 </div>
                 <!--<transition name="fade">-->
                     <div v-if="(curstep == 1 || curstep == 3)  && bdstate && showBoundary" class="mb-10 bg-fff bdr-3 mt-10 bx-sz">
                         <div class="b-fot h-30 lh-30 p-l10 p-r10 c-6 fz-12">
                            {{ $t('adjustBoundaryLine') }}
                         </div>
                         <div class="display text-center mt-5r lh-24r p-b10r">
                            <div class="adjust-boundary">
                                <div class="title">{{$t('toothPosition')}}</div>
                                <div v-for="item in boundaryToothArray1" :key="item.index" :class="['teeth-item',{'bou-active': item.choose,'disabled':!item.flag}]" @click="boundaryClick(item)">
                                    {{item.index}}
                                </div>
                                <div v-for="item in boundaryToothArray2" :key="item.index" :class="['teeth-item',{'bou-active': item.choose,'disabled':!item.flag}]" @click="boundaryClick(item)">
                                    {{item.index}}
                                </div>
                            </div>
                         </div>
                     </div>
                 <!--</transition>-->
                 <!--要点按钮才显示下面面板 zlb 21/3/3-->
                 <!--<transition name="fade">-->
                     <rightdivs
                     v-if="(curstep == 1 || curstep == 3) && !bdstate"
                         :marginLine="marginLine"
                         :btnType="historyBtnDate[2].class"
                         @DenBoundaryline="DenBoundaryline"
                         @onLoss="onLoss"
                         @onResetoper="onResetoper"
                         @resetBack="resetBack"
                         ref="rightdivs"
                     ></rightdivs>
                 <!--</transition>-->

                 <!--<transition name="fade">-->
                   <history-btn
                     v-if="(curstep == 1 || curstep == 3)"
                     :historyBtnDate="historyBtnDate"
                     @historyClick="historyClick"
                   ></history-btn>
                 <!--</transition>-->

                 <!--<div v-if="(curstep == 2 || curstep == 4)" style="display: grid;flex-direction: column;row-gap: 5px;">
                       <yg-imgtxtbtn filename='vs1' :btn-txt='$t("showHideOralScanData")' :bval="curstep == 2 ? showJaw2 : showJaw4" @click="onShowJaw"></yg-imgtxtbtn>
                       <yg-imgtxtbtn filename='vs1' :btn-txt='$t("memoryToothMesh")' :bval="saveTeeth" @click="onSaveTeeth"></yg-imgtxtbtn>
                       <yg-imgtxtbtn filename='vs1' :btn-txt='$t("distanceField")' :bval="curstep == 2 ? showToohDist2 : showToohDist4" @click="onShowToohDist"></yg-imgtxtbtn>
                 </div>-->
                </div>

            </div>

            <!--牙齿近远中 三个小窗口 -->
            <div :class="['date201130_tcCanvas', isShowAnteroposteriorView == 1 ? 'zInx-11' : 'z_inxH']">
                <div @click="goPreTooth"
                     :class="isGreyPre?'win_btn_left_grey':'win_btn_left'"
                     :style="isGreyPre?{'cursor': 'not-allowed',}:{}">
                    <!--                     @onmouseover="btnOver(0)"-->
                    <!--                     @onmouseout="btnOut(0)"-->
                    <!--                     @mousedown="btnDown(0)"-->
                    <!--                     @onmouseup="btnUp(0)"-->
                    <!--                     @mouseenter="btnEnter(0)"-->
                    <!--                     @mouseleave="btnLeave(0)"-->
                    <img :src="this.leftUrl.url" />
                </div>
                <div @click="goNextTooth"
                    :class="isGreyNext?'win_btn_right_grey':'win_btn_right'"
                    :style="isGreyNext?{'cursor': 'not-allowed',}:{}"
                    >
                    <!--                    @onmouseover="btnOver(1)"-->
                    <!--                    @onmouseout="btnOut(1)"-->
                    <!--                    @mousedown="btnDown(1)"-->
                    <!--                    @onmouseup="btnUp(1)"-->
                    <!--                    @mouseenter="btnEnter(1)"-->
                    <!--                    @mouseleave="btnLeave(1)"-->
                    <img :src="this.rightUrl.url" />
                </div>
                <div :class="['tcCanvasWrap',{'borderActive':whichWindow == 0}]">
                    <dx-canvas ref="anteroposteriorView1" :params="dxCanvasView1"  @click="clickAxis(0)"></dx-canvas>
                    <!--<canvas
                        id="anteroposteriorView1"
                        :width="viewpicsize.anteroposteriorView1.width"
                        :height="viewpicsize.anteroposteriorView1.height"
                        @click="clickAxis(0)"
                    />-->
                    <span class="axis" v-show="curstep === 5 || curstep === 6">{{$t('frontViewTeeth') + ' ' + axisToothId }}</span>
                </div>
                <div :class="['tcCanvasWrap',{'borderActive':whichWindow == 1}]">
                    <dx-canvas ref="anteroposteriorView2" :params="dxCanvasView2"  @click="clickAxis(1)"></dx-canvas>
                    <!--<canvas
                        id="anteroposteriorView2"
                        :width="viewpicsize.anteroposteriorView2.width"
                        :height="viewpicsize.anteroposteriorView2.height"
                        @click="clickAxis(1)"
                    />-->
                    <span class="axis" v-show="curstep === 5 || curstep === 6">{{$t('sideViewTeeth') + ' ' + axisToothId }}</span>
                </div>
                <div :class="['tcCanvasWrap',{'borderActive':whichWindow == 2}]">
                    <dx-canvas ref="anteroposteriorView3" :params="dxCanvasView3"  @click="clickAxis(2)"></dx-canvas>
                    <!--<canvas
                        id="anteroposteriorView3"
                        :width="viewpicsize.anteroposteriorView3.width"
                        :height="viewpicsize.anteroposteriorView3.height"
                        @click="clickAxis(2)"
                    />-->
                    <span class="axis" v-show="curstep === 5 || curstep === 6">{{$t('topViewTeeth') + ' ' + axisToothId }}</span>
                </div>
            </div>

            <!--近远中页面调整牙位工具组件-->
            <tooth-position-move
                data-title="1"
                ref="JYZtooth"
                v-if="showadjview && isShowAnteroposteriorView == 1"
                :moveData="JYZtoothMove"
                :moveInx="JYZtoothMoveInx"
                type="tooth"
                :allCommandControl="allCommandControl"
                :classType="'JYZtooth'"
                :coordinateActiveTooth="coordinateActiveTooth"
                :currentTeethWidth="currentTeethWidth"
                @handleMove="handleMove"
                @left="leftMinus"
                @right="rightAdd"
                key="JYZtooth"
            ></tooth-position-move>

            <!--调整牙位工具组件-->
            <tooth-position-move
                data-title="2"
                ref="adjtooth"
                v-if="adjtooth"
                :moveData="toothMove"
                :moveInx="moveFinalInx"
                type="tooth"
                :classType="'Adjtooth'"
                :classWidth="classWidth"
                :allCommandControl="allCommandControl2"
                :coordinateActiveTooth="coordinateActiveTooth"
                :moreTooth="moreTooth"
                :currentTeethWidth="currentTeethWidth"
                :toothPositionEmpty="toothPositionEmpty"
                @valReset="valReset"
                @handleMove="handleMove"
                @left="leftMinus"
                @right="rightAdd"
                @hanleBlur="hanleBlur"
                @hanleFocus="hanleFocus"
                key="Adjtooth"
            ></tooth-position-move>

            <!--矢状面调整 及 咬合面调整-->
            <sagittal-plane-adj
                v-if="showpA==1 && curstep==0"
                :moveData="sacoType == 1?saplaneAdjMove:ocplaneAdjMove"
                :moveInx="moveFinalInxPA"
                :type="sacoType == 1 ? 'sagittal' : 'occlusal'"
                @valResetPA="valResetPA"
                @handleMovePA="handleMovePA"
                @leftPA="leftMinusPA"
                @rightPA="rightAddPA"
                @hanleBlurPA="hanleBlurPA"
                @hanleFocusPA="hanleFocusPA"
            ></sagittal-plane-adj>

            <!--bolton指数面板-->
            <bolton-num
                :type="'planA'"
                :movetable ="mvtbv"
                :faterwidth="view_w"
                :boltonData="boltonobj"
                :viewcontrastv="viewcontrastv"
                @preventCanvasMove="preventCanvasMove"
                @openCanvasMove="openCanvasMove"
            ></bolton-num>

            <!--工具按钮-->
            <div class="p-abs auto-top-tools" style="transform:translateX(-50%);top:15px;left: 50%; z-index:11;display: flex; flex-wrap: nowrap;">  <!--:style="toptoolposition()"-->
                <yg-picbtn :icopath="toolIcoPath" :title="$t('upperJawTip')"         :disabled="modelposition"  icofname="maxilla" stecnt="3" class="pbtn35"     @click.stop="onToolEvt($event,'maxilla')"></yg-picbtn>
                <yg-picbtn :icopath="toolIcoPath" :title="$t('maxillarybuccalview')"  :disabled="upDownPosition=='updisab'|| upDownPosition=='both'"    icofname="maxillareg" stecnt="3" class="pbtn35"  @click.stop="onToolEvt($event,'maxillareg')"></yg-picbtn>
                <yg-picbtn :icopath="toolIcoPath" :title="$t('rightJawTip')"     :disabled="modelposition"         icofname="rcheek" stecnt="3" class="pbtn35"      @click.stop="onToolEvt($event,'rcheek')"></yg-picbtn>
                <yg-picbtn :icopath="toolIcoPath" :title="$t('frontJawTip')"         :disabled="modelposition"          icofname="front" stecnt="3" class="pbtn35"       @click.stop="onToolEvt($event,'front')"></yg-picbtn>
                <yg-picbtn :icopath="toolIcoPath" :title="$t('leftJawTip')"     :disabled="modelposition"         icofname="lcheek" stecnt="3" class="pbtn35"      @click.stop="onToolEvt($event,'lcheek')"></yg-picbtn>
                <yg-picbtn :icopath="toolIcoPath" :title="$t('mandibularbuccalview')"   :disabled="upDownPosition=='downdisab'|| upDownPosition=='both'"    icofname="mandiblereg" stecnt="3" class="pbtn35" @click.stop="onToolEvt($event,'mandiblereg')"></yg-picbtn>
                <yg-picbtn :icopath="toolIcoPath" :title="$t('lowerJawTip')"         :disabled="modelposition"       icofname="mandible" stecnt="3" class="pbtn35"  @click.stop="onToolEvt($event,'mandible')"></yg-picbtn>
            </div>

            <!--画布部分-->
            <div class="hv-mid  bg-f9" ref="editplan-com">
                <div class="row h-p100 w-p100" >
                    <!-- 分牙窗口 左窗口-->
                    <div :class="['h-p100 midcenter',{'col-md-12':!viewcontrastv,'col-md-6':viewcontrastv}]" style="padding:0;z-index:10" v-show="aftertwoview == ''">
                        <!--网格-->
                        <show-gridsvg-vtwo v-show="gridshow" :w="viewpicsize.SplitTeethview.width" :h="view_h" :view="'planA'"></show-gridsvg-vtwo>
                        <span style="position:absolute;top:20%;left:50%;color:#666;transform:translateX(-50%)" v-show='viewcontrastv'>{{$t("initialState")}}</span>
                        <dx-canvas
                            ref="SplitTeethview"
                            :params="dxCanvasSplit"
                            @mousedown="OnMouseDownPerson(event,'SplitTeethview')"
                            @mousemove="OnMouseMovePerson(event,'SplitTeethview')"
                            @mouseup="onMouseUpPerson(event,'SplitTeethview')"
                            @mouseenter="OnMouseEnterPerson(event,'SplitTeethview')"
                            @dblclick="onDblclickPerson(event,'SplitTeethview')"
                        />
                        <!--<canvas id="SplitTeethview"
                            ref="SplitTeethview"
                            :class="{'pointerEvents': setBanScroll}"
                            :width="viewpicsize.SplitTeethview.width"
                            :height="viewpicsize.SplitTeethview.height"
                            style="'border-radius: 5px;width:'100%';"
                            @mousewheel="onMouseWheel($event,'SplitTeethview')"
                            @mouseenter="OnMouseEnter($event,'SplitTeethview')"
                            @mouseleave="OnMouseLeave($event,'SplitTeethview')"
                            @dblclick="onDblclick($event,'SplitTeethview')"
                            ondragstart="return false;"
                            @mousemove="OnMouseMove($event,'SplitTeethview')"
                            @mousedown="OnMouseDown($event,'SplitTeethview')"
                            @mouseup="onMouseUp($event,'SplitTeethview')"
                        />-->
                        <!--底部工具行-->
                        <!--<div class="auto-fot p-abs w-p100" style="bottom:10px;left:0;padding:0 30px " v-show="viewcontrastv && curview =='SplitTeethview'">
                            <table width="100%">
                                <tr>
                                    <td class="reThreebtn backnextstep" align="left" width="22%">
                                    </td>
                                    <td align="center"><slide-bar :value="zoom" :flag="'SplitTeethview'" @onSlidinput="onSlideChange" @onLeftclick="onSlideLeftClk" @onRightclick="onSlideRightClk"></slide-bar></td>
                                    <td align="right" width="20%"><yg-picbtn v-show="navhandv" icopath="/swan/static/img/autorowtooth/pubimg" icofname="navhand3" stecnt="4" class="nolrp"  @click="onSetPlanSte(0)"></yg-picbtn>
                                    <yg-picbtn v-show="!navhandv" icopath="/swan/static/img/autorowtooth/pubimg" icofname="navhand4" stecnt="4" class="nolrp" @click="onSetPlanSte(1)"></yg-picbtn></td>
                                </tr>
                            </table>
                        </div>-->
                    </div>
                    <!--可进行牙位调整提示信息-->
                    <tips-com @closeBtn="closeBtn" v-if="tipsshow && teethId==-1"></tips-com>

                    <!-- 排牙窗口 右窗口-->
                    <div :class="['h-p100 midcenter',{'col-md-12':aftertwoview=='rowteeth','col-md-6':viewcontrastv}]" v-show="viewcontrastv || aftertwoview=='rowteeth'" style="padding:0;z-index:10">
                        <!--固定牙齿提示信息-->
                        <fixed-tooth-tip @closeBtn="closeBtn" v-if="showFixedTip"></fixed-tooth-tip>
                        <!-- 牙位调整视角工具栏 -->
                        <ty-tool-com v-if="adjtooth" :gridshow="gridshow"></ty-tool-com>
                        <!--网格-->
                        <show-gridsvg-vtwo v-show="gridshow" :w="viewpicsize.RowTeethview.width" :h="view_h" :view="'planA'"></show-gridsvg-vtwo>
                        <span style="position:absolute;top:20%;left:50%;color:#666;transform:translateX(-50%)" v-show='viewcontrastv'>{{$t("alignmentState")}}</span>
                        <dx-canvas
                            ref="RowTeethview"
                            :params="dxCanvasRow"
                            @mousedown="OnMouseDownPerson(event,'RowTeethview')"
                            @mousemove="OnMouseMovePerson(event,'RowTeethview')"
                            @mouseup="onMouseUpPerson(event,'RowTeethview')"
                            @mouseenter="OnMouseEnterPerson(event,'RowTeethview')"
                            @dblclick="onDblclickPerson(event,'RowTeethview')"
                         />
                        <!--<canvas id="RowTeethview"
                            ref="RowTeethview"
                            :class="{'pointerEvents': setBanScroll}"
                            :width="viewpicsize.RowTeethview.width"
                            :height="viewpicsize.RowTeethview.height"
                            style="'border-radius: 5px;width:'100%';"
                            @mousewheel="onMouseWheel($event,'RowTeethview')"
                            @mouseenter="OnMouseEnter($event,'RowTeethview')"
                            @mouseleave="OnMouseLeave($event,'RowTeethview')"
                            @dblclick="onDblclick($event,'RowTeethview')"
                            ondragstart="return false;"
                            @mousemove="OnMouseMove($event,'RowTeethview')"
                            @mousedown="OnMouseDown($event,'RowTeethview')"
                            @mouseup="onMouseUp($event,'RowTeethview')"
                        />-->
                        <!--底部工具行-->
                       <!-- <div class="auto-fot p-abs w-p100" style="bottom:10px;left:0;padding:0 30px" v-show="viewcontrastv && curview =='RowTeethview'">
                            <table width="100%">
                                <tr>
                                    <td class="reThreebtn backnextstep" align="left" width="22%">
                                    </td>
                                    <td align="center"><slide-bar :value="zoom" :flag="'RowTeethview'" @onSlidinput="onSlideChange" @onLeftclick="onSlideLeftClk" @onRightclick="onSlideRightClk"></slide-bar></td>
                                    <td align="right" width="20%"><yg-picbtn v-show="navhandv" icopath="/swan/static/img/autorowtooth/pubimg" icofname="navhand3" stecnt="4" class="nolrp"  @click="onSetPlanSte(0)"></yg-picbtn>
                                    <yg-picbtn v-show="!navhandv" icopath="/swan/static/img/autorowtooth/pubimg" icofname="navhand4" stecnt="4" class="nolrp" @click="onSetPlanSte(1)"></yg-picbtn></td>
                                </tr>
                            </table>
                        </div>-->
                    </div>

                    <!--仅供参考 && !mvtbv && !simumove-->
                    <div class="forReferenceOnly" v-show="planPt.viewUniteTip" :style="[{'bottom':simumove ?'70px' : ''}]">{{$t('forReferenceOnly')}}</div>
                </div>
            </div>

            <!--底部工具行 v-show="!viewcontrastv"-->
            <div class="auto-fot p-abs w-p100" style="padding:0 30px;z-index:11"  :style="{bottom:simumove ? '70px':'10px', left: adjtooth  ? '-14px' :  '0'  }">
                <table width="100%">
                    <tr>
                        <td class="reThreebtn backnextstep" align="left" :width="planPt.modelTestTool ? '20%' : '85%'">
                        </td>
                        <td align="center">
                            <slide-bar
                                :value="zoom"
                                :flag="'main'"
                                @onSlidinput="onSlideChange"
                                @onLeftclick="onSlideLeftClk" @onRightclick="onSlideRightClk">
                            </slide-bar>
                        </td>
                        <td align="right" :width="planPt.modelTestTool ? '20%' : '5%'">
                            <yg-picbtn v-show="navhandv" icopath="/swan/static/img/autorowtooth/pubimg" icofname="navhand3" stecnt="4" class="nolrp"  @click="onSetPlanSte(0)"></yg-picbtn>
                            <yg-picbtn v-show="!navhandv" icopath="/swan/static/img/autorowtooth/pubimg" icofname="navhand4" stecnt="4" class="nolrp" @click="onSetPlanSte(1)"></yg-picbtn>
                        </td>
                    </tr>
                </table>
            </div>

            <!--播放区-->
            <div :class="['date200904_BF fixd_BF',teethposcomzindex == -1 ? 'z_inxH' : 'zInx-11']" v-show="teethposcom">
                <div class="controlBtnStyle">
                    <yg-picbtn :icopath="icopath" icofname="binit"   stecnt="4" :disabled="getCurPlayIx==0 || planPt.getIsPlayste" class="nolrp"  @click="onGotofirst"></yg-picbtn>
                    <yg-picbtn :icopath="icopath" icofname="breturn" stecnt="4" :disabled="prevBtn || getCurPlayIx==0 || planPt.getIsPlayste" class="nolrp"  @click="onGotoPrev"></yg-picbtn>
                    <yg-picbtn :icopath="icopath" icofname="bplay"   stecnt="4" :disabled="planPt.getIsPlayste" class="nolrp" v-show="!planPt.getIsPlayste" @click="onStart($event)"></yg-picbtn>
                    <yg-picbtn :icopath="icopath" icofname="bpause"  stecnt="4"  class="nolrp" @click="onPause" v-show="planPt.getIsPlayste"></yg-picbtn>
                    <yg-picbtn :icopath="icopath" icofname="bnext"   stecnt="4" class="nolrp"  :disabled="getCurPlayIx==stepsamount " @click="onGotoNext"></yg-picbtn>
                    <yg-picbtn :icopath="icopath" icofname="blast"   stecnt="4" class="nolrp"  :disabled="getCurPlayIx==stepsamount"  @click="onGotoLast"></yg-picbtn>
                </div>
                <!--进度区-->
                <process-bar ref="progresscomref" target="original" @pauseText="pauseText" @preventCanvasMove="preventCanvasMove"
                @openCanvasMove="openCanvasMove"></process-bar>
            </div>
            <!--选取种子点提示浮标-->
            <transition name="fade">

                <div v-show="setBuoyShow"  class="date201117_buoy" :style="buou_view">
                    <p v-show="curstep== 1">{{$t('startFormHere')}}</p>
                    <p v-show="curstep == 3">{{$t('startFormHere')}}</p>
                </div>
            </transition>


            <!-- 牙齿移动表 -->
            <div style="position:relative;bottom:0;right:0" :style="{width: appWidth-planPt.setRsideW.replace('px','') +'px'}" v-show="mvtbv">
                <move-table key="move_table" ref="move_table" style="position:absolute;top:0;left:0;background:#fff;padding: 10px 0 7px 10px;width: calc(100% - 140px);" :datalist="mvtbData" updnType="" ></move-table>
                <!-- 关闭按钮 -->
                <div class="close_movetable" @click="closemovetable" @mouseenter="movecloseicon='/swan/static/img/close_hover.png'" @mouseleave="movecloseicon='/swan/static/img/close.png'">
                    <img width="14" height="14" :src="movecloseicon" alt="">
                </div>
                <!-- 最后一步 -->
                <div class="p-rel  bx-sz p-l3 bg-fff" style="position: absolute;right: 0;bottom: -260px;height:260px;background:#fff;width:140px;overflow: hidden;padding: 0;">
                    <div class="w-110"  style="width:100%;margin-top:35px">
                        <div class="h-19 lh-19 w-p100 al-c bx-sz fz-12 laststep">&nbsp&nbsp{{$t('basalTeeth')}}&nbsp&nbsp</div>
                            <div class="al-c p-all5 p-tb3 bx-sz bg-fff laststepBTN">
                            <yg-button :class="['w-p100  fz-12 m-t2 last-btn',{'lastBtnAct':teethbase == 0}]" type="primary" style="height:29px" @click="onSetTeethbase(0)">{{$t('dentalCrown')}}</yg-button>
                            <yg-button v-show="false" :class="['w-p100  fz-12 m-t2 last-btn',{'lastBtnAct':teethbase == 1}]" type="primary" style="height:29px"  @click="onSetTeethbase(1)">{{$t('rootOfTooth')}}</yg-button>
                        </div>
                    </div>
                </div>
            </div>

            <!--咬合深度区 -->
            <div v-show="bitev" class="p-abs " :style="[{'zIndex':'11'},{'right': adjtooth ? '5px':'30px'},{'top' : topNum},{'transform':'translateY(-50%)'}]">
                <img src="/swan/static/img/deepRuler1.png"/>
            </div>

            <!-- 儿牙圈圈 最左-->
            <div @click="changeToothNum('child')" v-show="toothIdObj.childToothId != -1 && toothIdMsg" class="fgdefalut childCirMax" :style="setChildToothidStyle()">{{ toothIdObj.childToothId }}</div>
            <!-- 左圈圈 大-->
            <div @click="changeToothNum('max')" v-show="toothIdObj.maxToothId != -1 && toothIdMsg" class="fgdefalut numCirMax" :style="setMaxToothidStyle()">{{ toothIdObj.maxToothId }}</div>
            <!-- 右圈圈 小-->
            <div @click="changeToothNum('min')" v-show="toothIdObj.minToothId != -1 && toothIdMsg" class="fgdefalut numCirMin" :style="setMinToothidStyle()">{{ toothIdObj.minToothId }}</div>

        </div>
    `,
	components: {
		rowteethDialog, //自动排牙设置弹窗
		moveTable, // 移动表
		showGridsvgVtwo, //网格（beaver版）
		toothPositionMove, // 调整牙位
		sagittalPlaneAdj, //矢状面，咬合面调整
		processBar,//播放区域
		boltonNum,//bolton指数
		tipsCom, //可以调整牙位提示组件
		tyToolCom, //投影组件
		rightdivs, // 选择种子点
		historyBtn, // 撤销 恢复 重置
		fixedToothTip, // 固定牙齿提示
	},
	props: {
		showdailog: {
			type: Number,
			default: 0,
		},
		comstartsegmentfunc: {
			type: Number,
			default: 0,
		},
		//移动表是否选中了 t选中 f未选中
		mvtbv: {
			type: Boolean,
			default: false,
		},
		//咬合面是否选中了 t选中 f未选中
		bitev: {
			type: Boolean,
			default: false,
		},
		//视图对比是否选中了 t选中 f未选中
		viewcontrastv: {
			type: Boolean,
			default: false,
		},
		//右侧面板是否打开了 t打开 f未打开
		rightslidfold: {
			type: Boolean,
			default: false,
		},
		//网格是否选中 t选中 f未选中
		gridshow: {
			type: Boolean,
			default: false,
		},
		//父组件用于控制网格工具栏是否禁用 传递到这用于上下左右颌面工具是否禁用
		//t禁用 f不禁用
		modeltesttool: {
			type: Boolean,
			default: true,
		},
		//控制牙齿位置调整组件显t 隐f
		teethposcom: {
			type: Boolean,
			default: false
		},
		//切到视图对比页面 1007
		commandtwoview: {
			type: Boolean,
			default: false,
		},
		//是不是分窗之后的步骤
		aftertwoview: {
			type: String,
			default: '',
		},
		//为0的时候是从+自动排牙点击的确定 1是重新排牙点击的确定
		initdialog: {
			type: Number,
			default: 0
		},
		//判断点击的是adj还是rerow
		adjorrerow: {
			type: String,
			default: ''
		},
		//拔牙的配置
		shapeconfig: {
			type: Number,
			default: 1
		},
		//拔牙的配置
		teethconfig: {
			type: Number,
			default: 0
		},
		//片切的配置
		sliceconfig: {
			type: Number,
			default: 1
		},
		//拔牙配置
		ids: {
			type: Array,
			default: []
		},
		//拔牙配置
		fixids: {
			type: Array,
			default: []
		},

		//移动模拟
		simumove: {
			type: Boolean,
			default: false
		},
		//调整牙位
		adjtooth: {
			type: Boolean,
			default: false
		},
		teethposcomzindex: {
			type: Number,
			default: 11
		},
		firsttoautopage: {
			type: Number,
			default: 0
		}
	},
	data: function () {
		return {
			topNum: '50%',
			// zlb 22/3/20 改换组件
			dxCanvasSplit: {
				class: 'w-p100',                 // 样式绑定
				idName: 'SplitTeethview',       // 画布名称
				isShow: true,                    // 是否显示
				styleobj: {
					width: (window.innerWidth - 480) + 'px',
					height: (window.innerHeight - 107) + 'px',
					border: 'none'
				},
				userNewdec: true, // 用新解码方式
				isDisabledMup: false // 禁用mouseup事件
			},
			dxCanvasRow: {
				class: 'w-p100',                 // 样式绑定
				idName: 'RowTeethview',       // 画布名称
				isShow: true,                    // 是否显示
				styleobj: {
					width: ((window.innerWidth - 480) / 2) + 'px',
					height: (window.innerHeight - 107) + 'px',
					border: 'none'
				},
				userNewdec: true, // 用新解码方式
				isDisabledMup: false // 禁用mouseup事件
			},
			dxCanvasView1: {
				class: 'w-p100',                 // 样式绑定
				idName: 'anteroposteriorView1',       // 画布名称
				isShow: true,                    // 是否显示
				styleobj: {
					width: '120px',
					height: '130px',
					border: 'none'
				},
				userNewdec: true, // 用新解码方式
				isDisabledMup: false // 禁用mouseup事件
			},
			dxCanvasView2: {
				class: 'w-p100',                 // 样式绑定
				idName: 'anteroposteriorView2',       // 画布名称
				isShow: true,                    // 是否显示
				styleobj: {
					width: '120px',
					height: '130px',
					border: 'none'
				},
				userNewdec: true, // 用新解码方式
				isDisabledMup: false // 禁用mouseup事件
			},
			dxCanvasView3: {
				class: 'w-p100',                 // 样式绑定
				idName: 'anteroposteriorView3',       // 画布名称
				isShow: true,                    // 是否显示
				styleobj: {
					width: '120px',
					height: '130px',
					border: 'none'
				},
				userNewdec: true, // 用新解码方式
				isDisabledMup: false // 禁用mouseup事件
			},
			movecloseicon: '/swan/static/img/close.png',
			keybuf: {},
			leftUrl: {
				url: '/swan/static/img/autorowtooth/pubimg/arrow_left.png',
				default: '/swan/static/img/autorowtooth/pubimg/arrow_left.png',
				hover: '/swan/static/img/autorowtooth/pubimg/arrow_left_hover.png',
				active: '/swan/static/img/autorowtooth/pubimg/arrow_left_active.png',
				grey: '/swan/static/img/autorowtooth/pubimg/arrow_left_grey.png',
			},
			rightUrl: {
				url: '/swan/static/img/autorowtooth/pubimg/arrow_right.png',
				default: '/swan/static/img/autorowtooth/pubimg/arrow_right.png',
				hover: '/swan/static/img/autorowtooth/pubimg/arrow_right_hover.png',
				active: '/swan/static/img/autorowtooth/pubimg/arrow_right_active.png',
				grey: '/swan/static/img/autorowtooth/pubimg/arrow_right_grey.png',
			},
			isGreyPre: false,
			isGreyNext: false,
			stepsBtnDate: [{
				btnName: 'lastStep',
				class: 'not_allowed',
				icon: 'icon-zuojiantou1',
				show: true
			}, {
				btnName: 'nextStep',
				class: 'btn_defalut',
				icon: 'icon-zuojiantou1',
				show: true
			}, {
				btnName: 'complete',
				class: 'btn_defalut',
				icon: 'icon-zuojiantou1',
				show: false
			}],
			historyBtnDate: [{
				btnName: 'recall',
				class: 'not_allowed',
				icon: 'icon-chexiao'
			}, {
				btnName: 'recovery',
				class: 'not_allowed',
				icon: 'icon-chexiao'
			}, {
				btnName: 'reset',
				class: 'not_allowed',
				icon: 'icon-zhongzhishaixuan'
			}],
			screenx: 0, // 浮标x
			screeny: 0, // 浮标y
			setBuoyShow: false, // 选取种子点提示浮标
			tzzbNum: '', // 牙根选中 1为选中
			tzzbhouseActive: '', // 调整坐标hover
			fghouseActive: '', //分割hover
			SdhouseActive: '', //标定hover
			smstate: false, // 标定 说明 提示弹窗
			bdstate: true, // 标定初始按钮状态值
			defaultteethid: '/swan/static/img/common/lefticon/teethid.png?ver=6',
			activeteethid: '/swan/static/img/common/lefticon/newteethid.png?ver=6',

			defaultSd: '/swan/static/img/common/lefticon/biaoding.png?ver=6',
			activeSd: '/swan/static/img/common/lefticon/biaodingnew.png?ver=6?',

			biaodingwc: '/swan/static/img/common/lefticon/biaodingwc.png?ver=6',
			biaodingwcnew: '/swan/static/img/common/lefticon/biaodingwcnew.png?ver=6',

			tzzbDefalut: '/swan/static/img/common/lefticon/tzzbDefalut.png?ver=6',
			tzzbActive: '/swan/static/img/common/lefticon/tzzbActive.png?ver=6',
			marginLine: {
				jaw: [
					{ 38: '-' }, { 37: '-' }, { 36: '-' }, { 35: '-' }, { 34: '-' }, { 33: '-' }, { 32: '-' }, { 31: '-' },
					{ 41: '-' }, { 42: '-' }, { 43: '-' }, { 44: '-' }, { 45: '-' }, { 46: '-' }, { 47: '-' }, { 48: '-' }
				],
				maxilla: [
					{ 18: '-' }, { 17: '-' }, { 16: '-' }, { 15: '-' }, { 14: '-' }, { 13: '-' }, { 12: '-' }, { 11: '-' },
					{ 21: '-' }, { 22: '-' }, { 23: '-' }, { 24: '-' }, { 25: '-' }, { 26: '-' }, { 27: '-' }, { 28: '-' }
				],
				upCurix: 0, // 当前被操作的
				dnCurix: 0, // 当前被操作的
				curjaw: 'maxilla', // 当前操作的颌
			},
			marginLineReset: {
				jaw: [
					{ 38: '-' }, { 37: '-' }, { 36: '-' }, { 35: '-' }, { 34: '-' }, { 33: '-' }, { 32: '-' }, { 31: '-' },
					{ 41: '-' }, { 42: '-' }, { 43: '-' }, { 44: '-' }, { 45: '-' }, { 46: '-' }, { 47: '-' }, { 48: '-' }
				],
				maxilla: [
					{ 18: '-' }, { 17: '-' }, { 16: '-' }, { 15: '-' }, { 14: '-' }, { 13: '-' }, { 12: '-' }, { 11: '-' },
					{ 21: '-' }, { 22: '-' }, { 23: '-' }, { 24: '-' }, { 25: '-' }, { 26: '-' }, { 27: '-' }, { 28: '-' }
				],
				upCurix: 0, // 当前被操作的
				dnCurix: 0, // 当前被操作的
				curjaw: 'maxilla', // 当前操作的颌
			},
			// //////////////////////////
			icopath: '/swan/static/img/autorowtooth/playarea/',
			progress: 0,//顶部进度
			laseMessage: null,//收到服务器推送的图像信息
			//顶部方位工具按钮
			topToolBtn: [
				{ btnName: 'maxilla', command: 401, value: true },
				{ btnName: 'maxillareg', command: 402, value: 'no' },
				{ btnName: 'lcheek', command: 405, value: 'no' },
				{ btnName: 'front', command: 404, value: 'no' },
				{ btnName: 'rcheek', command: 403, value: 'no' },
				{ btnName: 'mandiblereg', command: 406, value: 'no' },
				{ btnName: 'mandible', command: 407, value: true },
			],
			modelposition: false, //顶部方位按钮是否禁用（t禁用 f不禁用）
			positionNav: 'front', //顶部工具默认高亮（front --> 正面高亮）
			upDownPosition: '', //顶部默认禁用(下颌颌面downdisab)(上颌颌面updisab)（上下颌面both）
			toolIcoPath: '/swan/static/img/autorowtooth/pubimg/', //顶部工具默认图片地址
			zoom: 55.5,//底部滑条的值（初始55.5）
			zoomSplit: 55.5,
			zoomRow: 55.5,
			setBanScroll: false, //控制画布响不响应鼠标操作
			//画布宽高
			viewpicsize: {
				SplitTeethview: {
					width: window.innerWidth - 480,
					height: window.innerHeight - 107
				},
				RowTeethview: {
					width: (window.innerWidth - 480) / 2,
					height: window.innerHeight - 107
				},
				anteroposteriorView1: {
					width: 120,
					height: 130
				},
				anteroposteriorView2: {
					width: 120,
					height: 130
				},
				anteroposteriorView3: {
					width: 120,
					height: 130
				},

			},
			curview: 'SplitTeethview',
			view_w: 0,
			view_h: 0,
			imageLoaded: true,//图像是否完成加载
			webglPlayer: {
				"SplitTeethview": null,
				"RowTeethview": null,
				"anteroposteriorView1": null,
				"anteroposteriorView2": null,
				"anteroposteriorView3": null
			},
			decodeWorker: {
				"SplitTeethview": null,
				"RowTeethview": null,
				"anteroposteriorView1": null,
				"anteroposteriorView2": null,
				"anteroposteriorView3": null
			},
			FIsMouseEnter: {
				"SplitTeethview": false,
				"RowTeethview": false,
				"anteroposteriorView1": false,
				"anteroposteriorView2": false,
				"anteroposteriorView3": false
			},
			BackCallback: {
				"SplitTeethview": null,
				"RowTeethview": null,
				"anteroposteriorView1": null,
				"anteroposteriorView2": null,
				"anteroposteriorView3": null
			},
			FrontCallback: {
				"SplitTeethview": null,
				"RowTeethview": null,
				"anteroposteriorView1": null,
				"anteroposteriorView2": null,
				"anteroposteriorView3": null
			},
			navhandv: false,//右下角切换图像旋转（false）平移(true)

			//坐标系错误相关参数
			coordErrorNum: {
				show: false,
				talign: 'left',
				width: '360px',
				height: '240px',
				title: '提示',
				showfoot: true,
			},
			//有相同牙齿编号弹框相关参数
			diaSameToothNum: {
				show: false,
				talign: 'left',
				width: '360px',
				height: '240px',
				title: '提示',
				showfoot: true,
			},
			//前牙区缺失弹框相关参数
			diaToothIdComplete: {
				show: false,
				talign: 'left',
				width: '360px',
				height: '240px',
				title: '提示',
				showfoot: true,
			},
			//不能编辑牙齿弹框相关参数
			diaNoOperationAxis: {
				show: false,
				talign: 'left',
				width: '360px',
				height: '240px',
				title: '提示',
				showfoot: true,
			},
			//拔牙过多弹框相关参数
			removeTooMany: {
				show: false,
				talign: 'left',
				width: '360px',
				height: '240px',
				title: '提示',
				showfoot: true,
			},
			showadjview: false,//调整视觉组件显（true）隐（false）
			stepOrUndo: 'redo', //控制显示上下一步（'step'）还是撤销恢复重置（'redo'）
			backstepdisable: true,//控制上一步禁t 不禁用f 的样式
			nextstepdisable: false,//控制下一步禁t 不禁用f 的样式
			touchDefaultback: false, //触屏模式下上一步的初始状态
			touchDefaultnext: false, //触屏模式下下一步的初始状态
			curstep: 0,//记录上下一步到了那一步（默认第0步）
			ToothNumValid: 1,//用于记录后端传递的牙位编号是否有效 1有 0无
			ToothIdComplete: 1,//用于记录后端传递的[1、2、3]标号是否完整 1完整 0不完整
			arch: null, //上下颌区分 1上颌 0下颌
			initToothIdPage: null,//是否是初始进入牙齿编号页
			//后端传递的牙位编号相关数据
			toothIdObj: {
				toothId: 22,//选中牙位编号
				minToothId: 21,//前一位 没有返回-1
				maxToothId: 23,//后一位 没有返回-1
				childToothId: 62,//对应位儿牙 没有返回-1
				posX: 100,//圆心x坐标
				posY: 100,//圆心y坐标
				pixelRadius: 22.5,//半径
				toothProperty: 1,//牙齿属性
				area: 1, // 1,4—左侧 2,3—右侧
			},
			toothIdMsg: false,//用于控制前端圈圈显t隐f
			changedToothId: 12,//改变后的牙齿编号（未用上）
			comstartsegmentfunc: null,
			mvtbData: null,//牙齿移动表数据
			teethbase: 0, // 点击移动表牙齿基底部处按钮当前序号索引
			JYZtoothMove: [{
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove1.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH1.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA1.png?var=20223_23',
				// resetVal: '0',
				newVal: '0.0E',
				unit: 'E',
				step: '0.1',
				fixed: 1,
				type: 2,
				disabled: true,
				backname: 'transz',
				backCommand: 1019,
				title: this.$t('extendDepress') //'伸长/压低'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove2.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH2.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA2.png?var=20223_23',
				// resetVal: '0',
				newVal: '0.0I',
				unit: 'I',
				step: '0.1',
				fixed: 1,
				type: 1,
				disabled: true,
				backname: 'transy',
				backCommand: 1018,
				title: this.$t('buccalSideBLingualSideL')//'颊侧(B+)/舌侧(L+)'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove3.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH3.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA3.png?var=20223_23',
				// resetVal: '0',
				newVal: '0.0I',
				unit: 'I',
				step: '0.1',
				fixed: 1,
				type: 0,
				disabled: true,
				backname: 'transx',
				backCommand: 1017,
				title: this.$t('nearFarMiddle')//'近中/远中'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove4.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH4.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA4.png?var=20223_23',
				// resetVal: '0',
				newVal: '0.0D',
				unit: 'D',
				step: '1',
				fixed: 1,
				type: 5,
				disabled: true,
				backname: 'rotatez',
				backCommand: 1022,
				title: this.$t('twistNearFarCenter')//'扭转近中(R+)/扭转远中(R-)'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove7.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH7.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA7.png?var=20223_23',
				// resetVal: '0',
				newVal: '0.0D',
				unit: 'D',
				step: '1',
				fixed: 1,
				type: 4,
				disabled: true,
				backname: 'rotatey',
				backCommand: 1021,
				title: this.$t('axleTitleNearFarCenter') //'轴倾近中(A+)/轴倾远中(A-)'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove9.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH9.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA9.png?var=20223_23',
				// resetVal: '0',
				newVal: '0.0D',
				unit: 'D',
				step: '1',
				fixed: 1,
				type: 3,
				disabled: true,
				backname: 'rotatex',
				backCommand: 1020,
				title: this.$t('torqueBuccalLingualSide') //'转矩颊侧(T+)/转矩舌侧(T-)'
			},
			],
			toothMove: [{
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove1.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH1.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA1.png?var=20223_23',
				// resetVal: '0',
				newVal: '0.0',
				step: '0.1',
				type: 2,
				disabled: true,
				backname: 'transz',
				backCommand: 1060,
				title: this.$t('extendDepress') //'伸长/压低'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove2.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH2.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA2.png?var=20223_23',
				// resetVal: '0',
				newVal: '0.0',
				step: '0.1',
				type: 1,
				disabled: true,
				backname: 'transy',
				backCommand: 1059,
				title: this.$t('buccalSideBLingualSideL')//'颊侧(B+)/舌侧(L+)'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove3.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH3.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA3.png?var=20223_23',
				// resetVal: '0',
				newVal: '0.0',
				step: '0.1',
				type: 0,
				disabled: true,
				backname: 'transx',
				backCommand: 1058,
				title: this.$t('nearFarMiddle')//'近中/远中'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove4.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH4.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA4.png?var=20223_23',
				// resetVal: '0',
				newVal: '0',
				step: '1',
				type: 5,
				disabled: true,
				backname: 'rotatez',
				backCommand: 1063,
				title: this.$t('twistNearFarCenter')//'扭转近中(R+)/扭转远中(R-)'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove7.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH7.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA7.png?var=20223_23',
				// resetVal: '0',
				newVal: '0',
				step: '1',
				type: 4,
				disabled: true,
				backname: 'rotatey',
				backCommand: 1062,
				title: this.$t('axleTitleNearFarCenter') //'轴倾近中(A+)/轴倾远中(A-)'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/toothMove9.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/toothMoveH9.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/toothMoveA9.png?var=20223_23',
				// resetVal: '0',
				newVal: '0',
				type: 3,
				step: '1',
				disabled: true,
				backname: 'rotatex',
				backCommand: 1061,
				title: this.$t('torqueBuccalLingualSide') //'转矩颊侧(T+)/转矩舌侧(T-)'
			},
			{
				defaultImg: '/swan/static/img/autorowtooth/teethMove/topRotate.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/topRotateH.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/topRotate.png?var=20223_23',
				// resetVal: '0',
				newVal: '0',
				type: 6,
				step: '1',
				disabled: true,
				backname: 'atRotateRootApex',
				backCommand: 1074,
				title: this.$t('rootTorque') //'根转矩（颊侧/舌侧）'
			},
			{
				defaultImg: '/swan/static/img/autorowtooth/teethMove/bottomRotate.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/bottomRotateH.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/bottomRotate.png?var=20223_23',
				// resetVal: '0',
				newVal: '0',
				type: 7,
				step: '1',
				disabled: true,
				backname: 'atRotateIncisalMargin',
				backCommand: 1075,
				title: this.$t('crownInclination') //'冠倾斜度(颊侧/舌侧)'
			},
			{
				defaultImg: '/swan/static/img/autorowtooth/teethMove/clockwise.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/clockwiseH.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/clockwise.png?var=20223_23',
				// resetVal: '0',
				newVal: '0',
				type: 8,
				step: '1',
				disabled: true,
				backname: 'atRotateMesioDistal1',
				backCommand: 1076,
				title: this.$t('rotateAroundNearCenter')//'绕近中旋转'
			},
			{
				defaultImg: '/swan/static/img/autorowtooth/teethMove/inverseRotate.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/inverseRotateH.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/inverseRotate.png?var=20223_23',
				// resetVal: '0',
				newVal: '0',
				type: 9,
				step: '1',
				disabled: true,
				backname: 'atRotateMesioDistal2',
				backCommand: 1077,
				title: this.$t('rotateAroundFarCenter')//'绕远中旋转'
			},
			],
			toothMoveInx: 12,// 牙位调整当前index
			JYZtoothMoveInx: -1,//近远中牙位调整当前index
			toothWidth: null, // 牙位调整牙宽
			teethId: -1, // 牙齿编号
			transStep: 0.1, // 移动步长
			rotateStep: 1,// 旋转步长
			inputblurNum: null, //用于记录input修改时的数据，最后这个数据判断无误了之后再赋值给newVal
			thePath: "back", //用于记录牙位移动数字是从哪里改变的(back后端 plusAndMinus加减号 inputval输入框)
			// isupdate:1, //用于控制牙位调整面板加减号能否点击 0不可 1可
			JYZisupdate: 1,//用于控制近远中牙位调整面板加减号能否点击 0不可 1可
			tipsshow: false, //牙位调整提示信息是否显示
			prevBtn: false, // 上一步按钮的状态
			nextBtn: vueStore.getters.getNextBtnState,
			downname: null, //鼠标按下时的窗口名
			control1009: false,//用于控制1009只在后端传递4012后会发送 f不发 t发
			control1066: null,
			axisToothId: null,//三小窗中的牙齿编号
			isShowAnteroposteriorView: 0,//是否显示近远中三窗 0隐藏 1显示
			whichWindow: 0,//三小窗的选中边框
			upJYZborderActive: 0, //记录用户在上颌时选择的最后一个视角
			downJYZborderActive: 0, //记录用户在下颌时选择的最后一个视角

			showpA: 0, //是否显示手动正定调整面板 0隐藏 1显示
			//矢状面调整相关数据
			saplaneAdjMove: [{
				defaultImg: '/swan/static/img/autorowtooth/teethMove/patoothMovesa1.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/patoothMovesa1.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/patoothMovesa1.png?var=20223_23',
				resetVal: '0mm',
				newVal: '0mm',
				disabled: true,
				backname: 'transZ',
				backCommand: 1011,
				title: this.$t('leftRightTranslation') // 左右平移
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/patoothMovesa2.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/patoothMovesa2.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/patoothMovesa2.png?var=20223_23',
				resetVal: '0°',
				newVal: '0°',
				disabled: true,
				backname: 'transZ',
				backCommand: 1012,
				title: this.$t('rotate') //'旋转'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/patoothMovesa3.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/patoothMovesa3.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/patoothMovesa3.png?var=20223_23',
				resetVal: '0°',
				newVal: '0°',
				disabled: true,
				backname: 'transZ',
				backCommand: 1013,
				title: this.$t('turn') //'翻转'
			},],
			//咬合面调整相关数据
			ocplaneAdjMove: [{
				defaultImg: '/swan/static/img/autorowtooth/teethMove/patoothMoveoc1.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/patoothMoveoc1.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/patoothMoveoc1.png?var=20223_23',
				resetVal: '0mm',
				newVal: '0mm',
				disabled: true,
				backname: 'transZ',
				backCommand: 1011,
				title: this.$t('upDownTranslation') //'上下平移'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/patoothMoveoc2.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/patoothMoveoc2.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/patoothMoveoc2.png?var=20223_23',
				resetVal: '0°',
				newVal: '0°',
				disabled: true,
				backname: 'transZ',
				backCommand: 1012,
				title: this.$t('rotate') //'旋转'
			}, {
				defaultImg: '/swan/static/img/autorowtooth/teethMove/patoothMoveoc3.png?var=20223_23',
				activeImg: '/swan/static/img/autorowtooth/teethMove/patoothMoveoc3.png?var=20223_23',
				hoveImg: '/swan/static/img/autorowtooth/teethMove/patoothMoveoc3.png?var=20223_23',
				resetVal: '0°',
				newVal: '0°',
				disabled: true,
				backname: 'transZ',
				backCommand: 1013,
				title: this.$t('turn') //'翻转'
			},],
			toothMoveInxPA: null, //咬合面或矢状面调整当前index
			sacoType: null,//当前是咬合面调整组件（occlusal）还是矢状面调整组件（sagittal）
			touchEvent: false,
			backfinishstep: 0, //后端传递过来的播放区结束的标号
			//后端传递过来的Bolton指数数据
			boltonobj: {
				down3_3width: "0.00",
				down6_6width: "0.00",
				frontratio: "0.00",
				up3_3width: "0.00",
				up6_6width: "0.00",
				wholeratio: "0.00",
				upcrowdedness: "0.00",
				downcrowdedness: "0.00"
			},

			modelDrag: false, //模型是否被拖动
			firsttimeshowtip: true,//第一次出现tips
			ocSrc: '/swan/static/img/autorowtooth/teethMove/occlusal.png',
			ocSrcCheck: '/swan/static/img/autorowtooth/teethMove/occlusal_check.png',
			saSrc: '/swan/static/img/autorowtooth/teethMove/sagittal.png',
			saSrcCheck: '/swan/static/img/autorowtooth/teethMove/sagittal_check.png',
			boundaryToothArray1: [], //边界线调整识别到的牙齿数组
			boundaryToothArray2: [], //边界线调整识别到的牙齿数组
			boundaryArch: 0, //  0-下颌，1-上颌 下颌 31-38 41-48 上颌 11-18 21-28
			currentTeethWidth: 0,// 当前牙宽
			coordinateActiveTooth: -1, // 牙齿坐标系当前牙齿编号
			moreTooth: '', // 牙齿坐标系当前联合移动牙齿编号
			allCommandControl: true, // 控制排牙方案过程牙位调整的粗调m键状态
			allCommandControl2: true, // 排牙完
			isBlueConfirm: false, // 确认按钮的边框颜色
			toothPositionEmpty: true, // 排牙牙齿编辑值控件清空
			showFixedTip: false, // 显示牙齿固定提示信息
			curModel: 0, // 0 单体移动 1 联合移动

			showJaw2: false, // 第二步的显示隐藏口扫数据按钮
			showJaw4: false,// 第四步的显示隐藏口扫数据按钮
			saveTeeth: false,// 储存分牙mesh
			showToohDist2: false, // 第二步的距离场
			showToohDist4: false,// 第四步的距离场
		}
	},
	computed: {
		//从vuex取移动表数据
		getMvTabledata: function () {
			return vueStore.getters.getMvTabledata
		},
		//从vuex取 牙位编号是否有效 1有 0无
		getToothIdValid: function () {
			return vueStore.getters.getToothIdValid
		},
		//从vuex取 牙位编号是否有效属于上颌还是下颌 1上 0下
		getToothIdArch: function () {
			return vueStore.getters.getToothIdArch
		},
		//牙宽
		classWidth: function () {
			return this.toothWidth;
		},
		//牙位调整当前index
		moveFinalInx() {
			return this.toothMoveInx;
		},
		//咬合面或矢状面当前index
		moveFinalInxPA() {
			return this.toothMoveInxPA;
		},
		//从vuex取 [1、2、3]标号是否完整 1完整 0不完整
		getToothIdComplete: function () {
			return vueStore.getters.getToothIdComplete
		},
		//从vuex取 是否是第一次进入牙齿编号页 1是 0不是
		getToothIdIsInit: function () {
			return vueStore.getters.getToothIdIsInit
		},
		// 播放区最大步数
		stepsamount() {
			var stepobj = vueStore.getters.getSteps;
			var maxStps = Math.max(stepobj.up, stepobj.down);
			return maxStps
		},
		planahistory() {
			return vueStore.getters.getPlanAHistory
		},
		buou_view() {
			if (this.curstep == 1) {
				return {
					'left': this.screenx - $($('.date201117_buoy')[0]).width() + 'px',
					'top': this.screeny - $($('.date201117_buoy')[0]).height() + 'px',
				}
			}
			if (this.curstep == 3) {
				return {
					'left': this.screenx + 'px',
					'top': this.screeny + 'px',
				}
			}
		},
		showBoundary() {
			return JSON.stringify(this.boundaryToothArray1) !== '[]' && JSON.stringify(this.boundaryToothArray2) !== '[]'
		},
		zoomPosition() {
			return this.adjtooth
		}
	},
	watch: {
		// computed监听不到对象的属性，
		'marginLine.upCurix': {
			deep: true,
			handler: function (nv) {
				this.isBlueConfirm = nv > 16
			}
		},
		// computed监听不到对象的属性，
		'marginLine.dnCurix': {
			deep: true,
			handler: function (nv) {
				this.isBlueConfirm = nv > 16
			}
		},
		// zlb 2022/3/20 配合新画布组运用
		viewpicsize: {
			handler: function (nv) {
				this.dxCanvasSplit.styleobj.width = this.viewpicsize['SplitTeethview'].width + 'px';
				this.dxCanvasSplit.styleobj.height = this.viewpicsize['SplitTeethview'].height + 'px';

				this.dxCanvasRow.styleobj.width = this.viewpicsize['RowTeethview'].width + 'px';
				this.dxCanvasRow.styleobj.height = this.viewpicsize['RowTeethview'].height + 'px';

				this.dxCanvasView1.styleobj.width = this.viewpicsize['anteroposteriorView1'].width + 'px';
				this.dxCanvasView1.styleobj.height = this.viewpicsize['anteroposteriorView1'].height + 'px';

				this.dxCanvasView2.styleobj.width = this.viewpicsize['anteroposteriorView2'].width + 'px';
				this.dxCanvasView2.styleobj.height = this.viewpicsize['anteroposteriorView2'].height + 'px';

				this.dxCanvasView3.styleobj.width = this.viewpicsize['anteroposteriorView3'].width + 'px';
				this.dxCanvasView3.styleobj.height = this.viewpicsize['anteroposteriorView3'].height + 'px';
			},
			deep: true
		},
		'planPt.autorowteethNum'(nv) {
			console.log("取消排牙的状态变了A", nv)
			if (!nv) {
				setTimeout(() => {
					this.stepOrUndo = 'step'
					this.planahistory = 1

					this.curstep = 0
					this.stepOrUndo = 'step'
					this.planahistory = 1
					this.stepsBtnDate[1].class = 'btn_defalut'
				}, 0)
			}
		},
		'planPt.autorowteethBNum'(nv) {
			console.log("取消排牙的状态变了B", nv)
			if (!nv) {
				setTimeout(() => {
					this.stepOrUndo = 'step'
					this.planahistory = 1

					this.curstep = 0
					this.stepOrUndo = 'step'
					this.planahistory = 1
					this.stepsBtnDate[1].class = 'btn_defalut'
					// this.viewContrastv = false //对比试图不选中 即不分窗
					// this.planPt.viewContrastv = false
					// this.planPt.modelTestTool = true
				}, 0)
			}
		},
		//进度值变化的时候显示进度
		progress: {
			handler: function (nv) {
				if (!nv || nv == -1) {
					vueStore.dispatch('setLoadVshow', false);
					vueStore.dispatch('setLoadokv', 0);
					// $yError({title:'错误',msg:'载入进度发生错误！'});
				} else {
					if (parseInt(nv) < 100) {
						vueStore.dispatch('setLoadVshow', true);
						vueStore.dispatch('setLoadokv', parseInt(nv));
						// this.showLoading();
					} else {
						vueStore.dispatch('setLoadVshow', false);
						vueStore.dispatch('setLoadokv', 0);
						// this.closeloading();
					}
				}
			},
		},
		//平移旋转按钮发送命令
		navhandv: {
			handler: function (nv) {
				let val = nv ? 1 : 0
				let obj = {
					"command": 409,
					"value": val,
				}
				this.Excute(obj)
			}
		},
		//上一步下一步的当前步骤
		curstep: {
			handler: function (nv) {
				// this.$emit('curstepforindex',nv)
				console.log(nv, 'curstep');
				//处于第一步骤时 上一步加禁用样式
				this.backstepdisable = nv == 0 ? true : false
				//处于第五步骤时 调整视图组件显示
				this.showadjview = nv == 5 || nv == 6 ? true : false
				//处于第七步骤时 上下一步组件隐藏
				this.stepOrUndo = nv == 7 ? '' : this.stepOrUndo
				let _this = this
				let rest24Status = function () {
					// 离开第2、4步会重置状态，也就是1、3、5步的时候重置
					_this.showJaw2 = false
					_this.showJaw4 = false
					_this.showToohDist2 = false
					_this.showToohDist4 = false
				}
				switch (nv) {
					case 0://正定
						this.positionNav = 'front'
						this.upDownPosition = ''
						this.modelposition = false
						break;
					case 1://调整边缘线
						this.marginLine.curjaw = 'maxilla'
						this.positionNav = 'maxillareg'
						this.upDownPosition = 'downdisab'
						this.modelposition = true
						rest24Status()
						break;
					case 2://调整牙齿编号
						this.positionNav = 'maxillareg'
						this.upDownPosition = 'downdisab'
						this.modelposition = true
						break;
					case 3://调整边缘线
						this.marginLine.curjaw = 'jaw'
						this.upDownPosition = 'updisab'
						this.positionNav = 'mandiblereg'
						this.modelposition = true
						rest24Status()
						break;
					case 4://调整牙齿编号
						this.upDownPosition = 'updisab'
						this.positionNav = 'mandiblereg'
						this.modelposition = true
						break;
					case 5://近远中
						this.positionNav = 'maxillareg'
						this.upDownPosition = 'downdisab'
						this.modelposition = true
						this.whichWindow = this.upJYZborderActive
						this.onResize()
						rest24Status()
						break;
					case 6://近远中
						this.upDownPosition = 'updisab'
						this.positionNav = 'mandiblereg'
						this.modelposition = true
						this.whichWindow = this.downJYZborderActive
						this.onResize()
						break;
					case 7://生成牙龈
						this.positionNav = 'front'
						this.upDownPosition = 'both'
						this.modelposition = true
						this.coordinateActiveTooth = -1
						this.stepOrUndo == ''
						// if(this.initdialog == 0){
						this.showdailog = Math.random()
						// }
						break;
				}
			}
		},
		//监听切换到分牙页面 1003
		comstartsegmentfunc: {
			handler: function (nv) {
				let self = this
				if (this.commandtwoview) {
					$.post(execejUrl, { 'command': 1007 }, function (response) {
						if (parseInt(response.code) === 1) {
							self.onResize()
							//强制解码 解决花屏问题-------------------------
							self.Excute({ 'command': 53, 'window': 'RowTeethview,SplitTeethview' })
							//------------------------------------------
						} else {
							console.error("SetSize response", response.info);
						}
					});
				} else if (!this.commandtwoview) {
					this.onResize()
					//强制解码 解决花屏问题-------------------------
					self.Excute({ 'command': 53, 'window': 'RowTeethview,SplitTeethview' })
				}
			}
		},
		//视图对比
		viewcontrastv: {
			handler: function (nv) {
				let self = this
				// this.Excute({'command':404})
				setTimeout(() => {
					//如果是第一次进来双窗 发送1007
					if (this.adjorrerow == '') {
						console.log("是否确定取消排牙A：", this.planPt.autorowteethNum)
						console.log("是否确定取消排牙B：", this.planPt.autorowteethBNum)
						if (!this.planPt.autorowteethNum && !this.planPt.autorowteethBNum) {
							$.post(execejUrl, { 'command': 1007 }, function (response) {
								if (parseInt(response.code) === 1) {
									self.onResize()
									//强制解码 解决花屏问题-------------------------
									// self.Excute({'command':53,'window':'RowTeethview,SplitTeethview'})
								} else {
									console.error("SetSize response", response.info);
								}
							});

						}
					} else if (this.control1009) {
						//如果是点击重新拍牙触发的双窗 发送1009
						$.post(execejUrl, { 'command': 1009 }, function (response) {
							if (parseInt(response.code) === 1) {
								self.onResize()
							} else {
								console.error("SetSize response", response.info);
							}
						});
						self.control1009 = false
					} else {
						//单纯点击视图对比按钮 触发双窗
						this.onResize()
					}
				}, 300);

				this.curview = 'RowTeethview'
				//如果视图对比选中了 就发送1057
				if (nv) {
					this.teethposcom = false
					this.Excute({ 'command': comBtnContrastView })
				} else {
					//如果视图对比没有选中 判断是否是点击的模拟移动（即点击模拟移动变成的单窗）
					if (this.adjorrerow.indexOf('adj') != -1) {
						this.teethposcom = true //播放区显示
						this.curview = 'RowTeethview'//当前画布为排牙窗口
						pubBusEvt.$emit("resetRowItemW");//播放区域重新获取宽度
					} else {//否则是重新排牙导致的视图对比没选中 （即重新排牙变成的单窗）
						this.teethposcom = false
						this.curview = 'SplitTeethview'
					}
				}
			}
		},
		//监听顶部网格等工具禁t不禁用f
		modeltesttool: {
			handler: function (nv) {
				if (!nv) {
					this.upDownPosition = '',
						this.positionNav = 'front'
					this.aftertwoview = ''
					this.modelposition = false //顶部方位按钮全都不禁用
				} else {
					if (this.adjorrerow.indexOf('rerow') != -1) {
						//变为第七步时的状态
						this.positionNav = 'front'
						this.upDownPosition = 'both'
						this.modelposition = true
					}
				}
			}
		},
		// 在子组件改变了teethposcom 监听改变 同步到index
		teethposcom: {
			handler: function (nv) {
				// this.teethposcom = nv 不用赋值 监听到改变 值会从index再传过来
				this.$emit('forchangeteethposcom', nv)
			}

		},
		//从vuex取 牙位编号是否有效 1有 0无
		getToothIdValid: {
			handler: function (nv) {
				this.ToothNumValid = nv
			}
		},
		//从vuex取 [1,2,3]标号是否完整 1完整 0不完整
		getToothIdComplete: {
			handler: function (nv) {
				this.ToothIdComplete = nv
				setTimeout(() => {
					if (this.arch == this.curstep && this.initToothIdPage == 1) {
						this.diaToothIdComplete.show = nv == 1 ? false : true
					}
				}, 300);
			}
		},
		//从vuex取 牙位编号是否有效属于上颌还是下颌 1上 0下
		//上颌第二步 下颌第四步
		getToothIdArch: {
			handler: function (nv) {
				this.arch = nv == 1 ? 2 : 4
			}
		},
		//从vuex取 是否是第一次进入牙齿编号页 1是 0不是
		getToothIdIsInit: {
			handler: function (nv) {
				this.initToothIdPage = nv
			}
		},
		// 取牙齿移动表数据
		getMvTabledata: {
			handler: function (nv) {
				this.mvtbData = JSON.parse(JSON.stringify(nv))
			}
		},
		// 自动排牙弹框显隐
		showdailog: {
			handler: function (nv) {

			},
			immediate: true
		},
		//排牙配置（形状）
		shapeconfig: {
			handler: function (nv) {

			},
			immediate: true
		},
		//排牙配置（拔牙的）
		teethconfig: {
			handler: function (nv) {

			},
			immediate: true
		},
		//片切配置（拔牙的）
		sliceconfig: {
			handler: function (nv) {

			},
			immediate: true
		},
		//模拟移动
		simumove: {
			handler: function (nv) {
				if (nv) {
					this.Excute({ 'command': comStartMoveSimulation, 'value': 1 })
				} else {
					this.Excute({ 'command': comStartMoveSimulation, 'value': 0 })
				}
			}
		},
		//牙位调整按钮
		adjtooth: {
			handler: function (nv) {
				let self = this
				if (!nv) {
					this.tipsshow = false
				}
				if (nv && this.firsttimeshowtip) {
					this.firsttimeshowtip = false
					this.tipsshow = true
					setTimeout(() => {
						self.tipsshow = false
					}, 10000);
				}
			}
		},
		//是否是第一次进入排牙界面
		firsttoautopage: {
			handler: function (nv) {
				if (nv == 1) {
					this.stepOrUndo = 'step' //变为上下一步组件
				}
			}
		},
		//监听牙位调整组件内部数据变化
		// toothMove:{
		//     handler:function(nv){
		//         if(this.thePath != "plusAndMinus") return
		//         this.Excute({'command':nv[this.toothMoveInx].backCommand,'value':nv[this.toothMoveInx].newVal})
		//     },
		//     deep:true
		// },
		// 固定牙齿提示
		showFixedTip: {
			handler: function (nv) {
				let self = this
				if (nv) {
					setTimeout(() => {
						self.showFixedTip = false
					}, 10000);
				}
			}
		},
	},
	created: function () {
		document.oncontextmenu = function () { return false; }
		//后端传递的牙齿编号相关信息
		pubBusEvt.$off('fgTeeth')
		pubBusEvt.$on('fgTeeth', val => {
			this.toothIdMsg = true //控制前端圈圈显示
			this.toothIdObj.toothId = val.toothid
			this.toothIdObj.minToothId = val.prevtoothid ? val.prevtoothid : -1
			this.toothIdObj.maxToothId = val.nexttoothid ? val.nexttoothid : -1
			this.toothIdObj.childToothId = val.anotherid ? val.anotherid : -1
			this.toothIdObj.area = val.area ? val.area : 1 // 默认左侧
			this.toothIdObj.posX = val.posx
			this.toothIdObj.posY = val.posy
			this.toothIdObj.pixelRadius = val.radius
			// this.toothIdObj.toothProperty = val.toothProperty
		})
		pubBusEvt.$off('setFgstates') //关闭牙齿编号小圆圈（滑动条变化的时候）
		pubBusEvt.$on('setFgstates', val => {
			this.toothIdMsg = false; //关闭牙齿编号小圆圈
		})
		//牙位调整相关信息
		pubBusEvt.$off('teethPositonSet')
		pubBusEvt.$on('teethPositonSet', val => {
			let vm = this
			if (val.toothid != -1) {
				this.toothWidth = this.formatDecimal(val.toothwidth, 2)
				this.tipsshow = false
			} else {
				// 不设置为-1是因为按m键第一次没反应
				this.toothMoveInx = 12
				this.coordinateActiveTooth = -1
				this.currentTeethWidth = 0
				this.planPt.highlight = [] // 清除高亮的列
				// 牙位移动表取消选中
				this.$refs['move_table'].clearOtherStyle()
			}
			this.teethId = val.toothid
			// this.isupdate = val.isupdate
			this.thePath = "back"
			// for (const key in val) {
			//     for (const moveitem of vm.toothMove) {
			//         if(key == moveitem.backname){
			//             moveitem.newVal = val[key]
			//         }
			//     }
			// }


		})
		//近远中牙位调整相关信息
		pubBusEvt.$off('SendToothCoorDinateMove')
		pubBusEvt.$on('SendToothCoorDinateMove', val => {
			this.JYZisupdate = val.isupdate
			this.thePath = "back"
		})
		//是否显示小视窗（近远中三窗）
		pubBusEvt.$off('showAnteroposteriorView')
		pubBusEvt.$on('showAnteroposteriorView', val => {
			if (val == 0) {
				this.JYZtoothMoveInx = 6
			}
			this.isShowAnteroposteriorView = val
		})
		// 小视窗的牙位号
		pubBusEvt.$off('toothIdSubView')
		pubBusEvt.$on('toothIdSubView', val => {
			this.axisToothId = val
		})
		//控制手动正定调整面板是否显示
		pubBusEvt.$off('showAdjustPosDefPlane')
		pubBusEvt.$on('showAdjustPosDefPlane', val => {
			this.sacoType = val.type
			this.showpA = val.value
		})
		//返回当前不能编辑牙齿的信息
		pubBusEvt.$off('SendNoOperationAxis')
		pubBusEvt.$on('SendNoOperationAxis', val => {
			this.diaNoOperationAxis.show = true
		})
		//返回当前帧后端播放处理结束
		pubBusEvt.$off('playending')
		pubBusEvt.$on('playending', val => {
			this.backfinishstep = val
		})
		//Bolton指数
		pubBusEvt.$off('DisplayBolton')
		pubBusEvt.$on('DisplayBolton', par => {
			for (const backkey in par) {
				for (const frontkey in this.boltonobj) {
					if (frontkey == backkey) {
						this.boltonobj[frontkey] = this.formatDecimal(par[backkey], 2)
					}
				}
			}
		})
		pubBusEvt.$off('sendBtnsInfo')
		pubBusEvt.$on('sendBtnsInfo', msg => { // 后端返给前端的按钮信息
			let keys = Object.keys(msg)
			if (keys.includes('btnmanualsegment')) { //手动分割
				// this.enterSeedPtsSegmentation(msg.btnmanualsegment.selected)
			}
			if (keys.includes('btnpreviousstep')) { // 上一步
				this.stepsBtnDate[0].class = msg.btnpreviousstep.enable ? 'btn_defalut' : 'not_allowed'; // 上一步可点击
			}
			if (keys.includes('btnnextstep')) { // 下一步
				this.stepsBtnDate[1].class = msg.btnnextstep.enable ? 'btn_defalut' : 'not_allowed'; // 上一步可点击
			}
			console.log(this.stepsBtnDate)
			if (keys.includes('btnadjustaxis')) { // 调整坐标
				this.tzzbNum = msg.btnadjustaxis.selected ? '1' : '';
			}
		})
		// 分割牙齿时，判断是否有重复编号的牙齿
		pubBusEvt.$off('CancelToothLabelToNext')
		pubBusEvt.$on('CancelToothLabelToNext', msg => {
			this.planPt.isSendToothIdValid = msg.value
			// if (this.upload != 4) {
			//     if (msg.value == 0) {
			//         this.nextFUN(1);
			//     } else {
			//         this.$yError({
			//             title: this.$t('error'),
			//             msg: this.$t('toothNumRepeat')
			//         });
			//     }
			// }
		})
		// 是否自动标定信息（浮标）
		pubBusEvt.$off('SendAISegment')
		pubBusEvt.$on('SendAISegment', msg => {
			this.setBuoyShow = msg.visible === 1
			msg.tippos && (this.screenx = msg.tippos.x)
			msg.tippos && (this.screeny = msg.tippos.y)
		})

		// 选取种子点消息
		pubBusEvt.$off('PickPoint')
		pubBusEvt.$on('PickPoint', msg => {
			this.onSetYes(msg)
		})
		// 边界线留痕信息--疑似没用
		pubBusEvt.$off('GetSeedPtFromJson');
		pubBusEvt.$on('GetSeedPtFromJson', par => {
			this.historyBtnDate[0].class = 'btn_defalut'; // 打开撤回按钮
			if (this.marginLine.curjaw == "maxilla") {
				let tempYYUp = 16;
				par.forEach((item, index) => {
					if (index < 16) {
						let toothId = this.marginLine.maxilla[index];
						toothId[Object.keys(toothId)[0]] = item == 0 ? this.$t('no') : this.$t('yes');
					} else {
						tempYYUp++;
					}
				})
				this.marginLine.upCurix = tempYYUp;
			} else {
				let tempYYDown = 16;
				par.forEach((item, index) => {
					if (index < 16) {

						let toothId = this.marginLine.jaw[index];
						toothId[Object.keys(toothId)[0]] = item == 0 ? this.$t('no') : this.$t('yes');
					} else {
						tempYYDown++;
					}

				})
				this.marginLine.dnCurix = tempYYDown;
			}
		})
		// 分牙处理留痕消息
		pubBusEvt.$off('treatmentOfDentition')
		pubBusEvt.$on('treatmentOfDentition', msg => {
			this.curstep = msg.arch == 1 ? 1 : 3; // 上下颌
			this.stepsBtnDate[0].class = 'btn_defalut'; // 上一步可点击
			// 后端数据，因为后端选取种子点分为了两个步骤，所以后面的序列减一
			// 2选取种子点(还没有显示边界线) 3选取种子点(显示边界线的状态) 4.分割牙齿 5牙齿近远中 6牙冠长轴 7坐标轴 8牙根,
			switch (Number(msg.segmentteethsubstage)) {
				case 2:
					// vueStore.commit('UPLOAD2', String(msg.segmentteethsubstage));
					this.$nextTick(() => {
						// this.bdStateClick(); // 执行点击标定按钮
					})
					break;
				case 3:
					// this.showLine(1) // 执行显示边界线状态 传 1 表示为留痕消息
					break;
				case 8:
					// vueStore.commit('UPLOAD2', String(msg.segmentteethsubstage - 1));
					if (this.curstep == 3) {
						this.stepsBtnDate[1].show = false;
						this.stepsBtnDate[2].show = true;
					}
					break;
				default:
				// vueStore.commit('UPLOAD2', String(msg.segmentteethsubstage - 1));
			}
		})
		pubBusEvt.$on('changeBtnStatus', msg => {
			this.isGreyPre = msg.prevactive == 0 ? true : false // 如果==0，禁用按钮
			msg.prevactive == 0 ? this.leftUrl.url = this.leftUrl.grey : this.leftUrl.url = this.leftUrl.default
			this.isGreyNext = msg.nextactive == 0 ? true : false
			msg.nextactive == 0 ? this.rightUrl.url = this.rightUrl.grey : this.rightUrl.url = this.rightUrl.default

		})


		// 监听边缘线牙齿数组
		pubBusEvt.$off('boundaryToothEvent')
		pubBusEvt.$on('boundaryToothEvent', msg => {
			// 0 下颌 31-38 41-48
			// 1 上颌 11-18 21-28
			this.boundaryToothArray1 = []
			this.boundaryToothArray2 = []
			if (msg.arch == 0) {
				for (let i = 38; i > 30; i--) {
					this.boundaryToothArray1.push({
						index: i,
						flag: false,
						choose: false
					})
				}
				for (let i = 41; i < 49; i++) {
					this.boundaryToothArray2.push({
						index: i,
						flag: false,
						choose: false
					})
				}
			} else if (msg.arch == 1) {
				for (let i = 18; i > 10; i--) {
					this.boundaryToothArray1.push({
						index: i,
						flag: false,
						choose: false
					})
				}
				for (let i = 21; i < 29; i++) {
					this.boundaryToothArray2.push({
						index: i,
						flag: false,
						choose: false
					})
				}
			}
			this.boundaryToothArray1.forEach(item => {
				msg.teeth.forEach(child => {
					if (item.index == child) {
						item.flag = true
					}
				})
			})
			this.boundaryToothArray2.forEach(item => {
				msg.teeth.forEach(child => {
					if (item.index == child) {
						item.flag = true
					}
				})
			})
		})

		// 点击的牙位信息
		pubBusEvt.$off('boundaryToothId')
		pubBusEvt.$on('boundaryToothId', msg => {
			msg.activetooth = msg.activetooth ? msg.activetooth : [999]
			this.boundaryToothArray1.forEach(item => {
				msg.activetooth.forEach(child => {
					if (item.index == child) { item.choose = true }
					else { item.choose = false }
				})
			})
			this.boundaryToothArray2.forEach(item => {
				msg.activetooth.forEach(child => {
					if (item.index == child) { item.choose = true }
					else { item.choose = false }
				})
			})
		})

		// 牙齿坐标系调整值
		pubBusEvt.$off('CoordinateAxisAdjust')
		pubBusEvt.$on('CoordinateAxisAdjust', msg => {
			// 不显示提示固定牙齿弹窗
			this.showFixedTip = false
			// 不清空消息
			this.toothPositionEmpty = false
			// type 0~5(transX,transY,transZ, rotateX,rotateY,rotateZ)
			let { tooth, axisvals, toothwidth, selectteeth, highlight } = msg
			if (this.planPt.alignDone) { this.planPt.highlight = highlight }
			this.currentTeethWidth = toothwidth.toFixed(1)
			this.coordinateActiveTooth = tooth
			// 联合移动未选中牙齿控件选中
			if (tooth === -1 && !selectteeth) {
				this.toothMoveInx = 12
			}
			if (selectteeth) {
				let res = ''
				let len = selectteeth.length
				selectteeth.forEach((item, index) => {
					res += index === len - 1 ? item : item + ','
				})
				this.moreTooth = res
			} else {
				this.moreTooth = ''
			}
			// 排牙方案进行中的牙位
			this.JYZtoothMove.forEach(item => {
				axisvals.forEach(child => {
					if ((item.type || item.type == 0) && item.type == child.axistype) {
						item.newVal = child.value
					}
				})
			})
			// 排牙完成后的牙位调整
			this.toothMove.forEach(item => {
				axisvals.forEach(child => {
					if ((item.type || item.type == 0) && item.type == child.axistype) {
						item.newVal = child.value
					}
				})
			})
			//  点击牙位表中的牙齿，
			//  此时牙位移动表中的牙位要对应
			pubBusEvt.$emit('CoordinateAxisAdjust2', { highlight: highlight, flag: false })
		})
		// 显示所有坐标轴
		pubBusEvt.$off('SendShowAllAxis')
		pubBusEvt.$on('SendShowAllAxis', msg => {
			this.allCommandControl = true
			this.allCommandControl2 = true
		})
		// 计算坐标系错误
		pubBusEvt.$off('calcCoordError')
		pubBusEvt.$on('calcCoordError', msg => {
			// 弹出提示弹窗
			this.coordErrorNum.show = true
		})
		// 排牙牙齿编辑值控件清空数据
		pubBusEvt.$off('schemeMoveInfoVisA')
		pubBusEvt.$on('schemeMoveInfoVisA', msg => {
			this.toothPositionEmpty = !Boolean(msg.select)
		})
		// 固定牙提示
		pubBusEvt.$off('selectFixedA')
		pubBusEvt.$on('selectFixedA', msg => {
			this.showFixedTip = Boolean(msg.isfix)
		})
		// 咬合接触top选择
		pubBusEvt.$off('deepTopNumberSelect')
		pubBusEvt.$on('deepTopNumberSelect', () => {
			if (this.bitev) {
				if (this.bitev && this.mvtbv && this.teethposcom && this.adjtooth) {
					if (window.innerHeight > 722) {
						this.topNum = '50%'
					} else {
						this.topNum = '60%'
					}
				} else if (this.bitev && this.mvtbv && this.adjtooth) {
					this.topNum = '56%'
				} else if (this.bitev && this.mvtbv && this.teethposcom) {
					this.topNum = '41%'
				}
				else {
					this.topNum = '50%'
				}
			} else {
				this.topNum = '50%'
			}
		})
	},
	mounted: function () {
		setInterval(() => {
			pubBusEvt.$emit('deepTopNumberSelect')
		}, 300)
		var self = this;
		/* 牙齿快捷键开始 */
		window.onkeyup = (evt) => {
			pubBusEvt.$emit('keyup2', evt)
		}
		window.onkeydown = (event) => {
			console.log("keybuf的值：", self.keybuf)
			let e = event || window.e;
			let keyCode = e.keyCode || e.which;
			if (true) {
				self.keybuf[keyCode] = true;
				console.log(`keydown ${JSON.stringify(self.keybuf)}`)
				switch (true) {
					case (self.keybuf[38]): self.leftMinus(0, 'JYZtooth', 1); this.setFalse(38); break;    // 伸长 ↑
					case (self.keybuf[40]): self.rightAdd(0, 'JYZtooth', 1); this.setFalse(40); break;     // 压低 ↓

					case (self.keybuf[66] && self.keybuf[187]): self.leftMinus(1, 'JYZtooth', 1); this.setFalse(66); break;    // 颊侧  b+
					case (self.keybuf[76] && self.keybuf[187]): self.rightAdd(1, 'JYZtooth', 1); this.setFalse(76); break;    // 舌侧  l+

					case (self.keybuf[37]): self.leftMinus(2, 'JYZtooth', 1); this.setFalse(); break;     // 近中  ←
					case (self.keybuf[39]): self.rightAdd(2, 'JYZtooth', 1); this.setFalse(); break;     // 远中 →

					case (self.keybuf[82] && self.keybuf[189]): self.rightAdd(3, 'JYZtooth', 1); this.setFalse(82); break;     // 扭转远中 r-
					case (self.keybuf[82] && self.keybuf[187]): self.leftMinus(3, 'JYZtooth', 1); this.setFalse(82); break;     // 扭转近中  r+

					case (self.keybuf[65] && self.keybuf[189]): self.rightAdd(4, 'JYZtooth', 1); this.setFalse(65); break;     // 轴倾远中  a-
					case (self.keybuf[65] && self.keybuf[187]): self.leftMinus(4, 'JYZtooth', 1); this.setFalse(65); break;     // 轴倾近中 a+


					case (self.keybuf[84] && self.keybuf[189]): self.rightAdd(5, 'JYZtooth', 1); this.setFalse(84); break;     // 转矩舌侧 t-
					case (self.keybuf[84] && self.keybuf[187]): self.leftMinus(5, 'JYZtooth', 1); this.setFalse(84); break;    // 转矩颊侧 t+

					case (self.keybuf[77] && self.JYZtoothMoveInx !== -1):
						this.allCommandControl = true
						self.JYZtoothMoveInx = -1
						self.Excute({ 'command': 1023, 'value': 0 })
						this.setFalse(77);
						break;    // 粗调 m self.leftMinus(6, 'JYZtooth');this.setFalse(77);
					case (self.keybuf[77] && self.JYZtoothMoveInx === -1):
						this.allCommandControl = true
						self.JYZtoothMoveInx = -1
						self.Excute({ 'command': 1023, 'value': 1 })
						this.setFalse(77);
						break;    // 精调 m self.rightAdd(6, 'JYZtooth');this.setFalse(77);
				}
				return;
			}
		}
		pubBusEvt.$on('keyup2', event => {
			var e = event || window.e;
			var keyCode = e.keyCode || e.which;
			this.keybuf[keyCode] = false;
		})
		/* 牙齿快捷键结束 */
		window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
		window.addEventListener('unload', e => this.unloadHandler(e))
		this.view_w = $(".hv-mid").width();
		this.view_h = $(".hv-mid").height();
		this.OnCreate();
		ygResizeObj.on(this.$refs['editplan-com'], function () {
			console.info("ygresize obj===", ygResizeObj)
			self.onResize();
			pubBusEvt.$emit("resetRowItemW");
		});
		this.$nextTick(() => {

		})
	},
	methods: {
		onShowJaw() {
			//显示/隐藏牙龈
			let val = 0
			if (this.curstep == 2) {
				this.showJaw2 = !this.showJaw2
				val = this.showJaw2 ? 1 : 0
			} else if (this.curstep == 4) {
				this.showJaw4 = !this.showJaw4
				val = this.showJaw4 ? 1 : 0
			}
			let param = {
				'command': comShowJaw,
				'value': val
			};
			this.Excute(param)
		},
		onSaveTeeth() {
			//存储分牙mesh
			let param = {
				'command': comSaveTeeth
			};
			this.Excute(param)
		},
		onShowToohDist() {
			//显示/隐藏牙龈
			let val = 0
			if (this.curstep == 2) {
				this.showToohDist2 = !this.showToohDist2
				val = this.showToohDist2 ? 1 : 0
			} else if (this.curstep == 4) {
				this.showToohDist4 = !this.showToohDist4
				val = this.showToohDist4 ? 1 : 0
			}
			let param = {
				'command': comShowToohDist,
				'value': val
			};
			this.Excute(param)
		},
		closemovetable() {
			this.planPt.onMvtb('planA')
		},
		// 边界线牙位表点击
		boundaryClick(item) {
			if (!item.flag) { return }
			let index = item.index
			this.boundaryToothArray1.forEach(item => {
				if (item.index == index) { item.choose = true }
				else { item.choose = false }
			})
			this.boundaryToothArray2.forEach(item => {
				if (item.index == index) { item.choose = true }
				else { item.choose = false }
			})
			let params = {
				command: comBoundarySelectTooth,
				tooth: index
			}
			this.Excute(params)
		},
		setFalse(num) {
			for (var i in this.keybuf) {
				if (num != 66 && num != 76 && num != 82 && num != 65 && num != 84) {
					this.keybuf[i] = false
				}
			}
		},
		/* 牙齿视图切换开始 */
		// btnOver(value){
		//     if(!this.isGreyPre && !this.isGreyNext){
		//         value == 0 ? this.leftUrl.url =  this.leftUrl.hover : this.rightUrl.url =  this.rightUrl.hover
		//     }
		// },
		// btnOut(value){
		//     value == 0 ? this.leftUrl.url =  this.leftUrl.default : this.rightUrl.url =  this.rightUrl.default
		// },
		// btnDown(value){
		//     if(!this.isGreyPre && !this.isGreyNext){
		//         value == 0 ? this.leftUrl.url =  this.leftUrl.active : this.rightUrl.url =  this.rightUrl.active
		//     }
		// },
		// btnUp(value){
		//     if(!this.isGreyPre && !this.isGreyNext){
		//         value == 0 ? this.leftUrl.url =  this.leftUrl.hover : this.rightUrl.url =  this.rightUrl.hover
		//     }
		// },
		// btnEnter(value){
		//     if(!this.isGreyPre && !this.isGreyNext){
		//         value == 0 ? this.leftUrl.url =  this.leftUrl.active : this.rightUrl.url =  this.rightUrl.active
		//     }
		// },
		// btnLeave(value){
		//     if(!this.isGreyPre && !this.isGreyNext){
		//         value == 0 ? this.leftUrl.url =  this.leftUrl.default : this.rightUrl.url =  this.rightUrl.default
		//     }
		// },
		goPreTooth() {
			this.Excutenoname(1033)
		},
		goNextTooth() {
			this.Excutenoname(1032)
		},
		Excutenoname: function (command) {
			var vm = this;
			var url = execejUrl;
			_obj = {
				command: command,
			};
			$.post(url, _obj, function (response) {
				if (parseInt(response.code) != 1) {
					console.error(response.info);
				}
			});
		},
		/* 牙齿视图切换结束 */

		// 显示边界线状态
		showLine() {
			// 算法的小步骤第二步分为了2 3 两步，所以当大于第三步时，往后加一
			let segmentStage = this.upload == 2 && this.stepsBtnDate[1].class == 'btn_defalut' ? '3' : Number(this.upload);
			segmentStage = segmentStage === '3' ? 3 : segmentStage >= 3 ? ++segmentStage : segmentStage;

			// let segmentStage;
			let archType;




			if (this.planPt.twosx == 2 && this.upload == 2) {
				archType = 0;
			} else if (this.planPt.twosx == 2 && this.upload > 2) {
				archType = 1
			} else {
				archType = 0;
			}
			let obj = {
				'command': comLastStep,
				'winname': this.planPt.winName,
				'isLastStep': !arguments[0],
				'segmentStage': segmentStage,
				'archType': archType
			}

			// 1 留痕来的消息，只更改ui不发消息，2从大于2步骤返回过来的，需要加参数
			switch (arguments[0]) {
				case 1:
					break;
				case 2:
					this.Excute(Object.assign(obj, { 'reload': 1 }));
					break;
				default:
					this.Excute(obj);
			}
			// vueStore.commit('UPLOAD2', '2');
			// this.bdstate = true
			this.historyBtnDate[2].class = 'not_allowed'; // 禁用重置
			this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
			this.stepsBtnDate[0].class = 'btn_defalut'; // 上一步可点击
			this.planPt.stepsBtnDate[1].class = 'btn_defalut'; // 下一步可点击

			// 上一步 完成 按钮 关闭
			this.stepsBtnDate[1].show = true;
			this.stepsBtnDate[2].show = false;
		},
		// 撤销 恢复 重置
		historyClick(index, type) {
			if (type !== 'not_allowed') {
				switch (index) {
					case 0:
						this.resetBack();
						break;
					case 1:
						break;
					case 2:
						this.onResetoper();
						break;
				}
			}
		},
		// 分割的鼠标经过
		fgChangeActive(num) {
			this.fghouseActive = num;
		},
		sdChangeActive(num) {
			this.SdhouseActive = num;
		},
		sdChangeActive3(num) {
			this.tzzbhouseActive = num
		},
		outsdChangeActive(num) {
			if (num == 1) {
				this.SdhouseActive = '';
			} else if (num == 2) {
				this.fghouseActive = ''
			} else if (num == 4) {
				this.tzzbhouseActive = ''
			}
		},

		// 手动标定提示弹窗
		shuoMing() {
			this.smstate = !this.smstate

		},
		// 标定弹窗
		bdStateClick() {
			if (this.bdstate) {
				this.bdstate = false;
				this.SdhouseActive = "";
				this.historyBtnDate[2].class = 'btn_defalut';  // 禁用重置
				this.stepsBtnDate[1].class = 'not_allowed';  // 禁用重置
				if (this.curstep == 1) {
					this.marginLineReset.curjaw = 'maxilla'
					this.marginLine = JSON.parse(JSON.stringify(this.marginLineReset))
				} else if (this.curstep == 3) {
					this.marginLineReset.curjaw = 'jaw'
					this.marginLine = JSON.parse(JSON.stringify(this.marginLineReset))
				}
				if (this.marginLine.curjaw == 'maxilla') {
					if (this.marginLine.upCurix <= 0) {
						this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
					} else {
						this.historyBtnDate[0].class = 'btn_defalut'; // 打开撤回按钮
					}
				} else {
					if (this.marginLine.dnCurix <= 0) {
						this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
					} else {
						this.historyBtnDate[0].class = 'btn_defalut'; // 打开撤回按钮
					}
				}
				// if (this.planPt.curstep == 1) {
				//     this.planPt.Excute({ 'command': comBtnselectUpArch, 'name': this.planPt.winName, 'arch': 0 });
				// } else if (this.planPt.curstep == 2) {
				//     this.planPt.Excute({ 'command': comBtnselectDownArch, 'name': this.planPt.winName, 'arch': 1 });
				// }
				if (this.curstep == 1) {
					this.Excute({ 'command': comEnterSeedPtsSegmentation, value: 1 });
				} else if (this.curstep == 3) {
					this.Excute({ 'command': comEnterSeedPtsSegmentation, value: 1 });
				}
			} else {
				this.bdstate = true;
				// this.setBuoyShow = false;
				this.historyBtnDate[2].class = 'not_allowed'; // 禁用重置
				this.historyBtnDate[1].class = 'not_allowed'; // 禁用重置
				this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
				if (this.curstep == 1) {
					this.Excute({ 'command': comEnterSeedPtsSegmentation, value: 0 });
				} else if (this.curstep == 3) {
					this.Excute({ 'command': comEnterSeedPtsSegmentation, value: 0 });
				}
			}
		},
		// 后端控制手动分割相关按钮样式
		enterSeedPtsSegmentation(selected) {
			if (!selected) {
				this.bdstate = true;
			} else {
				this.bdstate = false; // 打开
				this.SdhouseActive = "";
				this.historyBtnDate[2].class = 'btn_defalut'; // 禁用重置
				this.stepsBtnDate[1].class = 'not_allowed'; // 禁用重置
				if (this.marginLine.curjaw == 'maxilla') {
					if (this.marginLine.upCurix <= 0) {
						this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
					} else {
						this.historyBtnDate[0].class = 'btn_defalut'; // 打开撤回按钮
					}
				} else {
					if (this.marginLine.dnCurix <= 0) {
						this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
					} else {
						this.historyBtnDate[0].class = 'btn_defalut'; // 打开撤回按钮
					}
				}
			}
		},
		//计算边界线
		DenBoundaryline() {
			var upCurix = Number(this.marginLine.upCurix);
			var dnCurix = Number(this.marginLine.dnCurix);
			if (this.curstep == 1) {
				if (upCurix <= 16) {
					if (upCurix < 16) {
						this.$yAlert({
							title: this.$t('tips'),
							msg: this.$t('notCrownsTips')
						});
					}

					if (upCurix == 16) {
						this.$yAlert({
							title: this.$t('tips'),
							msg: this.$t('notGumsTips')
						});
					}
				} else {
					this.bdstate = true
					let map1 = []
					for (let i = 0; i < 16; i++) {
						map1 = map1.concat(Object.values(this.marginLine.maxilla[i]))
					}
					map1 = map1.map((item => {
						return item === '是' ? 1 : 0;
					}))
					let params = {
						command: comConfirmSeedSegmentation,
						TeethExistFlagArr: map1.join(",")
					}
					this.Excute(params);
					// this.Excute({ 'command': comEnterSeedPtsSegmentation, value: 0 }); // 退出手动标定
					this.historyBtnDate[2].class = 'not_allowed'; // 禁用重置
					this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
					this.stepsBtnDate[1].class = 'btn_defalut'; // 下一步可点击
				}
			} else if (this.curstep == 3) {
				if (dnCurix <= 16) {
					if (dnCurix < 16) {
						this.$yAlert({
							title: this.$t('tips'),
							msg: this.$t('notCrownsTips')
						});
					}

					if (dnCurix == 16) {
						this.$yAlert({
							title: this.$t('tips'),
							msg: this.$t('notGumsTips')
						});
					}
				} else {
					this.bdstate = true
					let map1 = []
					for (let i = 0; i < 16; i++) {
						map1 = map1.concat(Object.values(this.marginLine.jaw[i]))
					}
					map1 = map1.map((item => {
						return item === '是' ? 1 : 0;
					}))
					let params = {
						command: comConfirmSeedSegmentation,
						TeethExistFlagArr: map1.join(",")
					}
					this.Excute(params);
					this.historyBtnDate[2].class = 'not_allowed'; // 禁用重置
					this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
					this.stepsBtnDate[1].class = 'btn_defalut'; // 下一步可点击
				}
			}
		},

		// 缺失牙
		onLoss() {
			// var el = null;
			if (this.marginLine.curjaw == 'maxilla') {
				if (this.marginLine.upCurix >= 16) { return }
				// this.marginLine.upCurix++
				// var upCurix = this.marginLine.upCurix++
				//     console.log(upCurix)
				// el = this.marginLine.maxilla[upCurix];
				// for (key in el) {
				//     el[key] = this.$t('no')
				// }
				this.historyBtnDate[0].class = 'btn_defalut'; // 打开撤回按钮
				// this.setBuoyShow = false;
			} else {
				if (this.marginLine.dnCurix >= 16) { return }
				// this.marginLine.upCurix++
				// var dnCurix = this.marginLine.dnCurix++
				//     el = this.marginLine.jaw[dnCurix];
				// for (key in el) {
				//     el[key] = this.$t('no')
				// }
				this.historyBtnDate[0].class = 'btn_defalut'; // 打开撤回按钮
				// this.setBuoyShow = false;
			}
			this.Excute({ 'command': comMissingTooth, 'name': this.planPt.winName });
		},

		// 重置
		onResetoper() {
			if (this.marginLine.curjaw == 'maxilla') {
				// this.marginLine.upCurix = 0;
				// this.marginLine.maxilla.forEach(el => {
				//     for (key in el) {
				//         el[key] = '-'
				//     }
				// })
			} else {
				// this.marginLine.dnCurix = 0;
				// this.marginLine.jaw.forEach(el => {
				//     for (key in el) {
				//         el[key] = '-'
				//     }
				// })
			}
			this.Excute({ 'command': comResetAllSeedPts, 'name': this.planPt.winName });
			this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
			console.log('this.marginLine=', JSON.stringify(this.marginLine))
		},

		// 撤回
		resetBack() {
			// var el = null;
			if (this.marginLine.curjaw == 'maxilla') {
				// this.marginLine.upCurix--
				// var upCurix = --this.marginLine.upCurix;
				// el = this.marginLine.maxilla[upCurix];
				// for (key in el) {
				//     el[key] = '-'
				// }
				if (this.marginLine.upCurix <= 0) {
					this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
					this.Excute({ 'command': comUndoLastSeedPt, 'name': this.planPt.winName });
					return
				}
			} else {
				// this.marginLine.dnCurix--
				// var dnCurix = --this.marginLine.dnCurix
				// el = this.marginLine.jaw[dnCurix];
				// for (key in el) {
				//     el[key] = '-'
				// }
				if (this.marginLine.dnCurix <= 0) {
					this.historyBtnDate[0].class = 'not_allowed'; // 禁用撤回按钮
					this.Excute({ 'command': comUndoLastSeedPt, 'name': this.planPt.winName });
					return
				}
			}
			this.Excute({ 'command': comUndoLastSeedPt, 'name': this.planPt.winName });
		},

		// 设置为是
		onSetYes(toothinfo) {
			console.log('fdsafdsafdsafa', toothinfo)
			toothinfo = toothinfo ? toothinfo : []
			if (this.marginLine.curjaw == 'maxilla') {
				this.marginLine.upCurix = toothinfo.length
				// this.marginLine.upCurix++
				this.marginLine.maxilla.forEach(item => {
					let flag = false
					toothinfo.forEach(child => {
						for (let key in item) {
							if (key == child.fdi) {
								flag = true
								if (child.hastooth === 0) {
									item[key] = this.$t('no')
								} else if (child.hastooth === 1) {
									item[key] = this.$t('yes')
								} else {
									item[key] = '-'
								}
							}
						}
					})
					if (!flag) {
						for (let key in item) {
							item[key] = '-'
						}
					}
				})
				this.historyBtnDate[0].class = 'btn_defalut'; // 打开撤回按钮
				// this.setBuoyShow = false;
			} else {
				this.marginLine.dnCurix = toothinfo.length
				// this.marginLine.dnCurix++
				this.marginLine.jaw.forEach(item => {
					let flag = false
					toothinfo.forEach(child => {
						for (let key in item) {
							if (key == child.fdi) {
								flag = true
								if (child.hastooth === 0) {
									item[key] = this.$t('no')
								} else if (child.hastooth === 1) {
									item[key] = this.$t('yes')
								} else {
									item[key] = '-'
								}
							}
						}
					})
					if (!flag) {
						for (let key in item) {
							item[key] = '-'
						}
					}
				})
				this.historyBtnDate[0].class = 'btn_defalut'; // 打开撤回按钮
				// this.setBuoyShow = false;
			}
		},




		Excute: function (_obj) {
			var vm = this;
			var url = execejUrl;
			$.post(url, _obj, function (response) {
				if (parseInt(response.code) != 1) {
					console.error(response.info);
				}
			});
		},
		OnSvrNotify: function (msg) {
			//滑动条
			if (msg.command == 4009) {
				// debugger
				if (msg.value * 100 < 0) {
					this.zoom = 0;
				} else if (msg.value * 100 > 100) {
					this.zoom = 100;
				} else {
					this.zoom = msg.value * 100;
				}
			}
			if (msg.command == 4012) {
				if (this.adjorrerow != "") {
					this.control1009 = true
				}
			}
			// if(msg.command == comSendTipPosInTeethSeg){
			//     // 是否自动标定信息 0 手动 1 自动
			//      pubBusEvt.$emit('SendAISegment', msg);
			//  }
			//  if(msg.command == comConfirmSelectASeedPt){
			//     this.onSetYes(msg.value)
			//  }
		},
		// 鼠标形状
		SetCursor: function (cur) {
			if (this.curtype == cur)
				return;
			$('#' + this.curview).removeClass();
			this.curtype = cur;
			switch (this.curtype) {
				case 0:
					$('#' + this.curview).toggleClass('cur_df');
					break;
				case 1:
					// $('#' + this.curview).toggleClass('cur_move');
					break;
				case 2:
					$('#' + this.curview).toggleClass('cur_pt');
					break;
				case 6:
					// $('#' + this.curview).toggleClass('cur_open');
					break;
				case 7:
					// $('#' + this.curview).toggleClass('cur_close');
					break;
			}
		},
		// 平移 旋转按钮 1平移 0旋转
		onSetPlanSte: function (param) {
			this.navhandv = param == 1 ? true : false;
		},
		// 分窗竖线样式
		linestyle: function () {
			return {
				position: 'absolute',
				left: '50%',
				top: '50%',
				width: '1px',
				height: this.view_h * 0.8 + 'px',
				display: 'inline-block',
				zIndex: '11',
				background: '#d6d6d6',
				transform: 'translate(-50%, -50%)',
			}
		},
		// 滑条数据0-100转化为0-1
		zoomEvt: function (nv) {
			var vm = this;
			var url = execejUrl;
			var val = nv / 100.0
			val = val > 1 ? 1 : val < 0 ? 0 : val
			let _obj = {
				'command': comSliderChange,
				'value': val,
				// 'name': vm.winName
			};
			$.post(url, _obj, function (response) {
				if (parseInt(response.code) != 1) {
					console.error(response.info);
				}
			});
		},
		// 滑条减 -
		onSlideLeftClk: function (evt, flag) {
			this.zoom -= 5;
			if (this.zoom < 0) {
				his.zoom = 0
			}
			this.zoomEvt(this.zoom);
		},
		// 滑条加 +
		onSlideRightClk: function (evt, flag) {
			this.zoom += 5;
			if (this.zoom > 100) {
				this.zoom = 100
			}
			this.zoomEvt(this.zoom);
		},
		// 滑条值变化
		onSlideChange: function (evt, value, flag) {
			this.zoom = Number(evt.target.value)
			this.zoomEvt(this.zoom);
		},
		// 鼠标坐标信息
		swappos: function (x, y, vname) {
			var vm = this;
			var _curobj = vm.viewpicsize[vname],
				_curpicobj = vm.$refs[vname],
				_pw = $(_curpicobj).width(),
				_ph = $(_curpicobj).height(),
				_w = _curobj.width,
				_h = _curobj.height,
				_tL = x * _w / _pw,
				_tT = y * _h / _ph;
			return {
				x: parseInt(_tL),
				y: parseInt(_tT)
			}
		},
		// 鼠标滚轮事件
		onMouseWheel: function (event, name) {
			var e = window.event.wheelDelta
			if (this.zoom == 0 && e < 0) {
				return
			}
			if (this.zoom == 100 && e > 0) {
				return
			}
			var posobj = this.swappos(event.offsetX, event.offsetY, name);
			this.CTWndMouseX = posobj.x;
			this.CTWndMouseY = posobj.y;
			var vm = this;
			var url = execejUrl;
			//后端新架构命令-----------------
			let wheeldelta = event.wheelDeltaY < 0 ? -1 : 1
			param = {
				'command': 216,
				'name': name,
				'wheelDelta': wheeldelta,
			}
			//-------------------------------
			this.planPt.Send(param);
		},
		// 鼠标进入
		OnMouseEnter: function (evt, name) {
			if (this.imageLoaded == false) {
				return;
			}
			var vm = this;
			this.curview = name;
			param = {
				'command': comMouseEnter,
				'name': name,
			};
			this.planPt.Send(param, false);
			this.FIsMouseEnter[name] = true;
		},
		// 鼠标进入
		OnMouseEnterPerson: function (evt, name) {
			this.curview = name;
		},
		// 鼠标离开
		OnMouseLeave: function (evt, name) {
			try {
				if (evt.toElement.offsetParent.className == 'p-abs') {
					return;
				}
			} catch (err) { }
			if (this.imageLoaded == false) {
				return;
			}
			param = {
				'command': comMouseLeave,
				'name': name,
			};
			this.planPt.Send(param, false);
			this.FIsMouseEnter[name] = false;
		},
		// 双击鼠标
		onDblclick: function (evt, name) {
			if (this.imageLoaded == false) {
				return;
			}
			var vm = this;
			this.curview = name;
			param = {
				'command': comMouseDClick,
				'name': name,
			};
			this.planPt.Send(param, false);
			this.FIsMouseEnter[name] = true;
		},
		// 双击鼠标
		onDblclickPerson: function (evt, name) {
			this.curview = name;
		},
		// 鼠标移动
		OnMouseMove: function (event, name) {
			this.touchEvent = false
			// 主控端强制隐藏鼠标
			if (this.planPt.isMain == 1) {
				$('#cursorObj').hide();
			}
			if (this.imageLoaded == false) {
				return;
			}
			if (this.FIsMouseEnter[name] == false) {
				this.OnMouseEnter(name);
			}
			var posobj = this.swappos(event.offsetX, event.offsetY, name);
			var command = comMouseMove;
			if (event.buttons == 1 || event.buttons == 2 || event.buttons == 4) {
				command = comMouseDrag;
				this.isMouseDrag = true;  //zlb
				if (event.movementX == 0 && event.movementY == 0) {
					return;//没有移动，则忽略消息
				}
			}
			this.CTWndMouseX = posobj.x;
			this.CTWndMouseY = posobj.y;
			var vm = this;
			//新架构 命令---------------------------------
			if (command == comMouseMove) {
				param = {
					'command': 214,
					'name': name,
					'x': vm.CTWndMouseX,
					'y': vm.CTWndMouseY,
				}
			} else {
				let left = 0
				let right = 0
				let mid = 0
				if (event.buttons == 1) {
					left = 1
					right = 0
					mid = 0
				} else if (event.buttons == 2) {
					left = 0
					right = 1
					mid = 0
				} else {
					left = 0
					right = 0
					mid = 1
				}
				param = {
					'command': 215,
					'name': name,
					'x': vm.CTWndMouseX,
					'y': vm.CTWndMouseY,
					'shift': {
						'left': left,
						'right': right,
						'middle': mid,
					}
				}
			}
			//--------------------------------------------
			// ****解决过线闪动**** 11//
			if (this.curview != this.downname && this.modelDrag) {
				this.onMouseUp(event, this.downname)
				this.OnMouseDown(event, this.curview)
			}
			//  ************      //
			this.planPt.Send(param, true);
		},
		// 鼠标移动
		OnMouseMovePerson: function (event, name) {
			// ****解决过线闪动****//
			let self = this
			if (self.curview != self.downname && self.modelDrag) {
				self.$refs[self.downname].onMouseUp(event)
				self.$refs[self.curview].onMouseDown(event)
			}
		},
		// 鼠标按下
		OnMouseDown: function (event, name) {
			// this.curview = name
			this.downname = name
			this.modelDrag = true
			var posobj = this.swappos(event.offsetX, event.offsetY, name);
			// console.log('posobj=', posobj);
			// if (name == "OrthodonticView") {
			//     document.onmouseup = this.MouseUp0("OrthodonticView");
			// }
			// if (name == "OrthodonticViewEdit") {
			//     document.onmouseup = this.MouseUp0("OrthodonticViewEdit");
			// }
			this.toothIdMsg = false; //关闭牙齿编号小圆圈
			this.CTWndMouseIsDown = true;
			var command = comMouseDown;
			if (new Date().getTime() - this.touchtime < 300 && Math.abs(posobj.x - this.CTWndMousePX) < 10 && Math.abs(posobj.y - this.CTWndMousePY) < 10) {
				command = comMouseDClick;
			} else {
				this.touchtime = new Date().getTime();
			}
			this.CTWndMouseX = posobj.x; // event.offsetX;
			this.CTWndMouseY = posobj.y; // event.offsetY;
			this.CTWndMousePX = posobj.x; //event.offsetX;
			this.CTWndMousePY = posobj.y; //  event.offsetY;
			this.CTWndMouseButton = event.buttons;
			var vm = this;
			var url = execejUrl;
			// param = {
			//     'name': name,
			//     'x': vm.CTWndMouseX,
			//     'y': vm.CTWndMouseY,
			//     'px': vm.CTWndMousePX,
			//     'py': vm.CTWndMousePY,
			//     'button': event.buttons,
			//     'command': command
			// };
			//后端新架构命令---------------------------
			let left = 0
			let right = 0
			let mid = 0
			if (event.button == 0) {
				left = 1
				right = 0
				mid = 0
			} else if (event.button == 2) {
				left = 0
				right = 1
				mid = 0
			} else {
				left = 0
				right = 0
				mid = 1
			}
			param = {
				'command': 212,
				'name': name,
				'x': vm.CTWndMouseX,
				'y': vm.CTWndMouseY,
				'shift': {
					'left': left,
					'right': right,
					'middle': mid,
				}
			}
			//--------------------------------------------
			this.planPt.Send(param, false);
		},
		// 鼠标按下
		OnMouseDownPerson: function (event, name) {
			// 个性操作
			this.downname = name
			this.modelDrag = true
			this.toothIdMsg = false; //关闭牙齿编号小圆圈
		},
		// 鼠标弹起
		onMouseUp: function (evt, name) {
			this.modelDrag = false
			var evt = event || window.event;
			var targetObj = evt.target || evt.srcElement;
			// 如果不是画布触发的消息刚不向后端发送信息
			if (targetObj.tagName !== 'CANVAS') {
				return;
			}
			this.CTWndMouseIsDown = false;
			//console.log("mouse up ")
			var vm = this;
			var url = execejUrl;
			// param = {
			//     'name': name,
			//     'x': vm.CTWndMouseX,
			//     'y': vm.CTWndMouseY,
			//     'px': vm.CTWndMousePX,
			//     'py': vm.CTWndMousePY,
			//     'button': this.CTWndMouseButton,
			//     'command': comMouseUp
			// };

			//后端新架构命令---------------------------
			let left = 0
			let right = 0
			let mid = 0
			if (evt.button == 0) {
				left = 1
				right = 0
				mid = 0
			} else if (evt.button == 2) {
				left = 0
				right = 1
				mid = 0
			} else {
				left = 0
				right = 0
				mid = 1
			}
			param = {
				'command': 213,
				'name': name,
				'x': vm.CTWndMouseX,
				'y': vm.CTWndMouseY,
				'shift': {
					'left': left,
					'right': right,
					'middle': mid,
				}
			}
			//----------------------------------------
			this.CTWndMouseButton = 0;
			this.planPt.Send(param, false);
		},
		// 鼠标弹起
		onMouseUpPerson: function (evt, name) {
			this.modelDrag = false
		},
		// 顶部方位工具点击事件
		onToolEvt: function (evt, param) {
			this.positionNav = param;
			for (const eachTopToolBtnMsg of this.topToolBtn) {
				if (eachTopToolBtnMsg.btnName == param) {
					this.Excute({ "command": eachTopToolBtnMsg.command })
				}
			}
		},
		// 顶部方位工具的位置样式
		// toptoolposition:function(){
		//     return !this.viewcontrastv ? 'left:50%':this.curview == 'SplitTeethview' ? (this.rightslidfold? 'left:25%':'left:25%') :(this.rightslidfold?'left:75%':'left:75%')
		// },
		//拔牙过多时点击排牙配置的确定
		unableClose: function () {
			this.removeTooMany.show = true
		},
		// 排牙弹框确定按钮
		closeBtn: function (text) {
			switch (text) {
				case 'rowtee'://排牙设置弹框
					if (this.initdialog == 1) {
						this.$emit('secondtimetorowteethfuc')
						this.teethId = -1
						this.stepOrUndo = ''
					}
					this.$emit('dialogsure')
					break;
				case 'coordError': //计算坐标系错误
					this.coordErrorNum.show = false
					break;
				case 'sameId': //有相同牙位提示弹框
					this.diaSameToothNum.show = false
					break;
				case 'idcomplete'://前牙区缺失提示弹框
					this.diaToothIdComplete.show = false
					break;
				case 'NoOperationAxis'://播放区没到最后一帧提示弹框
					this.diaNoOperationAxis.show = false
					break;
				case 'tips'://可进行牙位调整提示
					this.tipsshow = false
					break;
				case 'fixedTooth':// 固定牙齿提示
					this.showFixedTip = false
					break;
				case 'overRemove'://牙齿不足12关闭
					this.removeTooMany.show = false
					break;
				case 'goOnRow'://牙齿不足12确定
					this.removeTooMany.show = false
					this.$refs.rowteethgoon.closeBtn('rowtee', 'goon')
					break;
			}
		},
		// 排牙弹框取消与关闭按钮
		onCancel: function () {
			// initdialog == 1说明是从重新排牙触发的弹窗
			if (this.curstep == 7 && this.initdialog != 1) {
				this.curstep = 6
				this.stepOrUndo = 'step'
			}
			this.$emit('dialogcancel')
		},
		//用户选择的片切(val) 1片切 0不片切 用户选择的拔牙配置（teeth）
		hasipr: function (val, teeth, shape) {
			this.$emit('indexhasipr', val, teeth, shape)
		},
		// 上一步 comPreStep
		backstep: function () {
			if (this.stepsBtnDate[0].class == 'not_allowed') {
				return
			}
			if (this.backstepdisable) return
			if (!this.bdstate) {
				this.bdstate = true
				this.setBuoyShow = false;
				// if (this.curstep == 1) {
				//   this.Excute({ 'command': comEnterSeedPtsSegmentation, jawtype: 1, value: 0 });
				// } else if (this.curstep == 3) {
				//   this.Excute({ 'command': comEnterSeedPtsSegmentation, jawtype: 2, value: 0 });
				// }
			}
			this.curstep--
			if (this.curstep < 0) {
				this.curstep = 0
			}
			this.Excute({ 'command': 1001, 'value': this.curstep })
			this.toothIdMsg = false //圈圈隐藏
		},
		// 下一步 comNextStep
		nextstep: function () {
			if (this.stepsBtnDate[1].class == 'not_allowed') {
				return
			}
			//编号重复弹框是否出现
			if (this.ToothNumValid == 0 && this.curstep == this.arch) {
				this.diaSameToothNum.show = true
				return
			}
			//[123]是否缺失
			if (this.ToothIdComplete == 0 && this.curstep == this.arch) {
				this.diaToothIdComplete.show = true
				return
			}
			this.curstep++
			if (this.curstep > 7) {
				this.curstep = 7
			}
			if (this.curstep != 7) {
				this.Excute({ 'command': 1002, 'value': this.curstep })
			}
			this.toothIdMsg = false //圈圈隐藏
		},
		// 上下一步鼠标进入
		onstepenter: function (e, text) {
			if (this.touchEvent) return
			if (text == 'backstep') {
				this.touchDefaultback = false
			} else {
				this.touchDefaultnext = false
			}
		},
		// 上下一步手指触摸
		onsteptouchstart: function (e, text) {
			this.touchEvent = true
			if (text == 'backstep') {
				this.touchDefaultback = false
			} else {
				this.touchDefaultnext = false
			}
		},
		// 上下一步手指抬起
		onsteptouchend: function (e, text) {
			this.touchEvent = true
			if (text == 'backstep') {
				this.touchDefaultback = true
			} else {
				this.touchDefaultnext = true
			}
		},
		// 左侧工具按钮合集
		lefttool: function (type) {
			switch (type) {
				// 按视觉位置调整生长方向
				case 'adjview':
					this.Excute({ 'command': 1004 })
					break;
				//咬合面按钮
				case 'oc':
					this.Excute({ 'command': 1014, 'type': 0 })
					break;
				//矢状面按钮（中心线）
				case 'sa':
					this.Excute({ 'command': 1014, 'type': 1 })
					break;
				default:
					break;
			}

		},
		// 鼠标进入中线 咬合面按钮
		ocsaenter: function (text) {
			if (text == 'oc') {
				this.$refs.ocRef.classList.remove('adjust_tool_img_small_leave')
				this.ocSrc = this.ocSrcCheck
			} else {
				this.$refs.saRef.classList.remove('adjust_tool_img_small_leave')
				this.saSrc = this.saSrcCheck
			}
		},
		// 鼠标离开中线 咬合面按钮
		ocsaleave: function (text) {
			if (text == 'oc') {
				this.ocSrc = '/swan/static/img/autorowtooth/teethMove/occlusal.png'
			} else {
				this.saSrc = '/swan/static/img/autorowtooth/teethMove/sagittal.png'
			}
		},
		// 点击圈圈
		changeToothNum: function (pos) {
			this.toothIdMsg = false //控制前端圈圈隐藏
			let changedToothId = pos == 'max' ? this.toothIdObj.maxToothId : (pos == 'min' ? this.toothIdObj.minToothId : this.toothIdObj.childToothId)
			let param = {
				'command': 1006,
				'toothId': this.toothIdObj.toothId,
				'changedToothId': changedToothId,
			}
			this.Excute(param)
		},
		// 圈圈 儿牙样式
		setChildToothidStyle: function () {
			return {
				position: 'absolute',
				top: this.toothIdObj.posY - this.toothIdObj.pixelRadius + 'px',//圆心纵坐标减去半径
				left: (this.toothIdObj.area == 1 || this.toothIdObj.area == 4) ? this.toothIdObj.posX - this.toothIdObj.pixelRadius * 5 - 3 + 'px' : this.toothIdObj.posX + this.toothIdObj.pixelRadius * 3 + 6 + 'px', // 画布上的圆真实大小会比div圆更小
				width: this.toothIdObj.pixelRadius * 2 + 'px',
				height: this.toothIdObj.pixelRadius * 2 + 'px',
				lineHeight: this.toothIdObj.pixelRadius * 2 + 'px',
				fontSize: this.toothIdObj.pixelRadius / 1.75 + 'px',
				zIndex: 11,
			}
		},
		// 圈圈 大数字样式
		setMaxToothidStyle: function () {
			return {
				position: 'absolute',
				top: this.toothIdObj.posY - this.toothIdObj.pixelRadius + 'px',//圆心纵坐标减去半径
				left: this.toothIdObj.posX + this.toothIdObj.pixelRadius + 3 + 'px',
				width: this.toothIdObj.pixelRadius * 2 + 'px',
				height: this.toothIdObj.pixelRadius * 2 + 'px',
				lineHeight: this.toothIdObj.pixelRadius * 2 + 'px',
				fontSize: this.toothIdObj.pixelRadius / 1.75 + 'px',
				zIndex: 11,
			}
		},
		// 圈圈 小数字样式
		setMinToothidStyle: function () {
			return {
				position: 'absolute',
				top: this.toothIdObj.posY - this.toothIdObj.pixelRadius + 'px',//圆心纵坐标减去半径
				left: this.toothIdObj.posX - this.toothIdObj.pixelRadius * 3 + 'px',
				width: this.toothIdObj.pixelRadius * 2 + 'px',
				height: this.toothIdObj.pixelRadius * 2 + 'px',
				lineHeight: this.toothIdObj.pixelRadius * 2 + 'px',
				fontSize: this.toothIdObj.pixelRadius / 1.75 + 'px',
				zIndex: 11,
			}
		},
		// 移动表右侧 牙根（1） 牙冠（0）按钮
		onSetTeethbase: function (num) {
			this.teethbase = num
		},
		// 三小窗点击事件
		clickAxis: function (val) {
			this.Excute({ 'command': 1024, 'value': val })
			if (this.curstep == 5) {
				this.upJYZborderActive = val
				this.whichWindow = this.upJYZborderActive
			} else if (this.curstep == 6) {
				this.downJYZborderActive = val
				this.whichWindow = this.downJYZborderActive
			}
		},
		preventCanvasMove: function () {
			this.setBanScroll = true
		},
		openCanvasMove: function () {
			this.setBanScroll = false
		},
		// 调整牙位相关方法-------------------------------------------
		// 点击每个item
		handleMove: function (index, classtype, arr) {
			this.allCommandControl = false
			this.allCommandControl2 = false
			if (classtype == 'JYZtooth') {
				this.JYZtoothMoveInx = index
			} else if (classtype == 'Adjtooth') {
				if (index !== 11) {
					this.toothMoveInx = index
				} else {
					this.toothMoveInx = -1
				}
			}
			switch (index) {
				case 0:
					this.Excute({ 'command': arr[index].backCommand })
					break;
				case 1:
					this.Excute({ 'command': arr[index].backCommand })
					break;
				case 2:
					this.Excute({ 'command': arr[index].backCommand })
					break;
				case 3:
					this.Excute({ 'command': arr[index].backCommand })
					break;
				case 4:
					this.Excute({ 'command': arr[index].backCommand })
					break;
				case 5:
					this.Excute({ 'command': arr[index].backCommand })
					break;
				case 6:
					this.Excute({ 'command': arr[index].backCommand })
					break;
				case 7:
					this.Excute({ 'command': arr[index].backCommand })
					break;
				case 8:
					this.Excute({ 'command': arr[index].backCommand })
					break;
				case 9:
					this.Excute({ 'command': arr[index].backCommand })
					break;
				case 10:
					this.Excute({ 'command': 1023, 'value': 1 })
					this.allCommandControl = true
					break;
				case 11:
					this.Excute({ 'command': 1065, 'value': 0 })
					this.allCommandControl2 = false
					break;
				case 12:
					this.Excute({ 'command': 1065, 'value': 1 })
					this.allCommandControl2 = true
					break;
				default:
					this.Excute({ 'command': 1065, 'value': 1 })
					this.allCommandControl2 = true
					break;

			}

		},
		// 重置按钮
		valReset: function () {
			this.Excute({ 'command': 1064 })
		},
		// 左减 -
		leftMinus: function (index, classtype, keyboard) {
			this.allCommandControl = false
			this.allCommandControl2 = false
			// 变化（显示总量逻辑）--------
			// this.toothMoveInx = index
			// this.thePath = "plusAndMinus"
			// let num = Number(this.toothMove[index].newVal) * 1000
			// if(index <= 2){
			//     num  -= this.transStep * 1000
			// }else{
			//     num -= this.rotateStep * 1000
			// }
			// num = num / 1000
			// this.toothMove[index].newVal = this.formatDecimal(num,2)
			// ------------------------
			if (classtype == 'JYZtooth') {
				this.JYZtoothMoveInx = index
				if (this.JYZisupdate == 1) {
					this.JYZisupdate = 0
					this.Excute({ 'command': this.JYZtoothMove[index].backCommand, 'value': '-' + this.JYZtoothMove[index].step, 'keyboard': keyboard })
				}
			} else if (classtype == 'Adjtooth') {
				this.toothMoveInx = index
				// if(this.isupdate == 1){
				//     this.isupdate = 0
				this.Excute({ 'command': this.toothMove[index].backCommand, 'value': '-' + this.toothMove[index].step, 'keyboard': keyboard })
				// }
			}
			// this.thePath = "plusAndMinus"
		},
		// 右加 +
		rightAdd: function (index, classtype, keyboard) {
			this.allCommandControl = false
			this.allCommandControl2 = false
			// 变化（显示总量逻辑）--------
			// this.toothMoveInx = index
			// this.thePath = "plusAndMinus"
			// let num = Number(this.toothMove[index].newVal) * 1000
			// if(index <= 2){
			//     num  += this.transStep * 1000
			// }else{
			//     num += this.rotateStep * 1000
			// }
			// num = num / 1000
			// this.toothMove[index].newVal = this.formatDecimal(num,2)
			// ------------------------
			if (classtype == 'JYZtooth') {
				this.JYZtoothMoveInx = index
				if (this.JYZisupdate == 1) {
					this.JYZisupdate = 0
					this.Excute({ 'command': this.JYZtoothMove[index].backCommand, 'value': this.JYZtoothMove[index].step, 'keyboard': keyboard })
				}
			} else if (classtype == 'Adjtooth') {
				this.toothMoveInx = index
				// if(this.isupdate == 1){
				//     this.isupdate = 0
				this.Excute({ 'command': this.toothMove[index].backCommand, 'value': this.toothMove[index].step, 'keyboard': keyboard })
				// }
			}
			// this.thePath = "plusAndMinus"
		},
		// input获取焦点事件
		hanleFocus: function (e) {
			this.thePath = "inputval"
			e.currentTarget.select();
		},
		// input失去焦点事件
		hanleBlur: function (index, item) {
			if (/^(-?\d+)?(\.\d+)?$/.test(item.newVal) && item.newVal !== '') {
				if (Math.abs(item.newVal) > 10) {
					num = item.newVal > 0 ? 10 : -10;
				} else {
					num = item.newVal
				}
				this.thePath = "plusAndMinus"
				item.newVal = this.formatDecimal(num, 2)
			} else {
				this.thePath = "inputval"
				this.$yError({
					title: this.$t('yErrorTip'),
					msg: "只能输入整数、小数"
				});
			}
		},


		// 咬合面及矢状面调整相关方法-------------------------------------------
		// 点击每个item
		handleMovePA: function (index) {
			this.toothMoveInxPA = index
			switch (index) {
				case 0: break;
				case 1: break;
				case 2: break;
			}
		},
		// 重置按钮
		valResetPA: function (movedata, type) {
			this.Excute({ 'command': 1010 })
			// for (const item of movedata) {
			//     item.newVal = '0.00'
			// }
			if (type == 'sagittal') {
				// 中线
				this.saplaneAdjMove.forEach(item => {
					item.newVal = item.resetVal
				})
			} else {
				// 咬合面
				this.ocplaneAdjMove.forEach(item => {
					item.newVal = item.resetVal
				})
			}
		},
		// 左减 -
		leftMinusPA: function (index, type) {
			let movearr = []
			if (type == 'sagittal') {
				// 中线
				movearr = this.saplaneAdjMove
				let res
				if (index == 0) {
					res = this.saplaneAdjMove[index].newVal.split('mm')[0]
					res = (Number(res) - 0.1).toFixed(1)
					res = res + 'mm'
				} else if (index == 1) {
					res = this.saplaneAdjMove[index].newVal.split('°')[0]
					res = Number(res) - 1
					res = res + '°'
				} else if (index == 2) {
					res = this.saplaneAdjMove[index].newVal.split('°')[0]
					res = Number(res) - 1
					res = res + '°'
				}
				this.$set(this.saplaneAdjMove[index], 'newVal', res)
			} else {
				// 咬合面
				movearr = this.ocplaneAdjMove
				let res
				if (index == 0) {
					res = this.ocplaneAdjMove[index].newVal.split('mm')[0]
					res = (Number(res) - 0.1).toFixed(1)
					res = res + 'mm'
				} else if (index == 1) {
					res = this.ocplaneAdjMove[index].newVal.split('°')[0]
					res = Number(res) - 1
					res = res + '°'
				} else if (index == 2) {
					res = this.ocplaneAdjMove[index].newVal.split('°')[0]
					res = Number(res) - 1
					res = res + '°'
				}
				this.$set(this.ocplaneAdjMove[index], 'newVal', res)
			}
			this.toothMoveInxPA = index
			// this.thePath = "plusAndMinus"
			// let num = Number(movearr[index].newVal) * Math.pow(10,3)
			// if(index <= 0){
			//     num  -= (0.1 * Math.pow(10,3))
			// }else{
			//     num -= (1 * Math.pow(10,3))
			// }
			// num = num / Math.pow(10,3)
			// movearr[index].newVal = this.formatDecimal(num,2)
			this.Excute({ 'command': movearr[this.toothMoveInxPA].backCommand, 'inc': 0 })

		},
		// 右加 +
		rightAddPA: function (index, type) {
			let movearr = []
			if (type == 'sagittal') {
				// 中线
				movearr = this.saplaneAdjMove
				let res
				if (index == 0) {
					res = this.saplaneAdjMove[index].newVal.split('mm')[0]
					res = (Number(res) + 0.1).toFixed(1)
					res = res + 'mm'
				} else if (index == 1) {
					res = this.saplaneAdjMove[index].newVal.split('°')[0]
					res = Number(res) + 1
					res = res + '°'
				} else if (index == 2) {
					res = this.saplaneAdjMove[index].newVal.split('°')[0]
					res = Number(res) + 1
					res = res + '°'
				}
				this.$set(this.saplaneAdjMove[index], 'newVal', res)
			} else {
				// 咬合面
				movearr = this.ocplaneAdjMove
				let res
				if (index == 0) {
					res = this.ocplaneAdjMove[index].newVal.split('mm')[0]
					res = (Number(res) + 0.1).toFixed(1)
					res = res + 'mm'
				} else if (index == 1) {
					res = this.ocplaneAdjMove[index].newVal.split('°')[0]
					res = Number(res) + 1
					res = res + '°'
				} else if (index == 2) {
					res = this.ocplaneAdjMove[index].newVal.split('°')[0]
					res = Number(res) + 1
					res = res + '°'
				}
				this.$set(this.ocplaneAdjMove[index], 'newVal', res)
			}
			this.toothMoveInxPA = index
			// this.thePath = "plusAndMinus"
			// let num = Number(movearr[index].newVal) * Math.pow(10,3)
			// if(index <= 0){
			//     num  += (0.1 * Math.pow(10,3))
			// }else{
			//     num += (1 * Math.pow(10,3))
			// }
			// num = num / Math.pow(10,3)
			// movearr[index].newVal = this.formatDecimal(num,2)
			this.Excute({ 'command': movearr[this.toothMoveInxPA].backCommand, 'inc': 1 })
		},
		// input获取焦点事件
		hanleFocusPA: function (e) {
			this.thePath = "inputval"
			e.currentTarget.select();
		},
		// input失去焦点事件
		hanleBlurPA: function (index, item) {
			if (/^(-?\d+)?(\.\d+)?$/.test(item.newVal) && item.newVal !== '') {
				if (Math.abs(item.newVal) > 10) {
					num = item.newVal > 0 ? 10 : -10;
				} else {
					num = item.newVal
				}
				this.thePath = "plusAndMinus"
				item.newVal = this.formatDecimal(num, 2)
			} else {
				this.thePath = "inputval"
				this.$yError({
					title: this.$t('yErrorTip'),
					msg: "只能输入整数、小数"
				});
			}
		},



		// 播放区域相关方法------------------------------------------------
		onProcessChanged(nv, arch) {
			this.Excute({
				'command': comPlayIndex,
				'value': nv,
			});
		},
		// 最前一步
		onGotofirst: function () {
			let curinx = vueStore.getters.getPlayinx;
			vueStore.dispatch('setPlayinx', 0);
			this.onProcessChanged(0, 0);
		},
		// 前一步
		onGotoPrev: function () {
			let curinx = vueStore.getters.getPlayinx;
			// if(this.backfinishstep != curinx){
			//     return
			// }
			this.isclickPause = 'notclickPause'
			vueStore.dispatch('setPlayinx', curinx - 1);
			this.onProcessChanged(curinx - 1, curinx - 1);
		},
		// 开始播放
		onStart: function (evt) {
			let curinx = vueStore.getters.getPlayinx;
			// if(this.backfinishstep != curinx){
			//     return
			// }
			this.isclickPause = 'notclickPause'
			//到最后一步时 再点击播放 回到第0步
			if (this.stepsamount == curinx) {
				vueStore.dispatch('setPlayinx', 0);
				// this.onProcessChanged(0, 0);
			}
			vueStore.dispatch('setPlayste', true);
			this.onGotoNext('playing');
			this.$parent.onBiterow('planA', 'play')
		},
		// 暂停播放
		onPause: function () {
			let curinx = vueStore.getters.getPlayinx;
			// if(this.backfinishstep != curinx){
			//     return
			// }
			this.isclickPause = 'clickPause'
			vueStore.dispatch('setPlayste', false)
			// setTimeout(() => {
			//     vueStore.dispatch('setPlayinx', curinx+1);
			// }, 50);
		},
		// 下一步
		onGotoNext: function (actionName) {
			let curinx = vueStore.getters.getPlayinx;
			// if(this.backfinishstep != curinx){
			//     return
			// }
			this.isclickPause = 'notclickPause'
			if (actionName !== 'playing') {
				vueStore.dispatch('setPlayste', false)
			}
			if (vueStore.getters.getPlayinx == Math.max(vueStore.getters.getSteps.up, vueStore.getters.getSteps.down)) {
				vueStore.dispatch('setPlayinx', -1)
			}
			vueStore.dispatch('setPlayinx', curinx + 1);
			this.onProcessChanged(curinx + 1, curinx + 1);

			// vueStore.dispatch('setPlayteeth', '');  // 将表格tr边框去掉

		},
		// 最后一步
		onGotoLast: function () {
			let curinx = vueStore.getters.getPlayinx;
			// if(this.backfinishstep != curinx){
			//     return
			// }
			this.isclickPause = 'notclickPause'
			vueStore.dispatch('setPlayste', false)
			vueStore.dispatch('setPlayinx', this.stepsamount);
			console.log(this.stepsamount)
			this.onProcessChanged(this.stepsamount, this.stepsamount);
		},
		pauseText: function () {
			this.isclickPause = 'notclickPause'
		},



		// 画布相关方法--------------------------------------------------
		initDecodeWorker: function (canvasid) {
			var vm = this;
			this.decodeWorker[canvasid] = newDecodeWorker(this.planPt.dec);
			this.decodeWorker[canvasid].onmessage = function (evt) {
				var msg = evt.data;
				switch (msg.command) {
					case kHEVCFrame:
						vm.onHEVCImage(msg);
						break;
					case kBlockFrame:
						vm.onBlockImage(msg);
						break;
					case kHEVCFrameFinish:
						vm.planPt.lastDecodeTime = Date.now();
						vm.planPt.decodeNum--;
						if (vm.planPt.decodeNum < 0) {
							vm.planPt.decodeNum = 0;
						}
						//console.log("Finish get image,decoding ",vm.planPt.decodeNum,",time:",(new Date()));
						break;
				}
			};
			var msg = {
				command: kOpenDecoderReq,
				// canvas: this.webglPlayer[canvasid],
				layerCount: 2
			};
			this.decodeWorker[canvasid].postMessage(msg);
			// this.decodeWorker[canvasid].postMessage(msg,[this.webglPlayer[canvasid]]);
		},
		onHEVCImage: function (msg) {
			this.webglPlayer[msg.canvasid].renderYUV(msg.data, msg.width, msg.height);
			// if (msg.canvasid == "OrthodonticView" || msg.canvasid == "OrthodonticViewEdit"){//透明图层填入空值
			//     var imageDat = new Uint8Array(msg.width*msg.height*4);
			//     this.webglPlayer[msg.canvasid].renderRGBA(imageDat,msg.width,msg.height,1);
			// }
			//console.log("DecodeH265,OpenDecoder,renderRGBA:",msg.canvasid,",layer:",msg.layer,",width:",msg.width,",height:",msg.height,",widthBytes:",msg.widthBytes);
			this.imageLoaded = true;
		},
		onBlockImage: function (msg) {
			var channel = msg.widthBytes / msg.width;
			if (channel == 3) {
				console.error("not support rgb zip image");
			} else if (channel == 1) {
				console.error("not support gray zip image");
			} else {
				this.webglPlayer[msg.canvasid].renderRGBA(msg.data, msg.width, msg.height, msg.layer);
			}
			this.imageLoaded = true;
			//console.log("DecodeZip,renderRGBA,canvasid:",msg.canvasid,",layer:",msg.layer,",width:",msg.width,",height:",msg.height,",widthBytes:",msg.widthBytes);
		},
		// 解码并显示
		DecodeH265: function (msg) {
			if (msg.image.byteLength == 0) {
				return;
			}
			var objData = {
				command: kFeedHEVCReq,
				data: msg.image,
				width: msg.width,
				height: msg.height,
				widthBytes: msg.widthBytes,
				canvasid: msg.name,
				layer: msg.layer,
				compressType: msg.compressType
			};
			if (this.decodeWorker[msg.name]) {
				this.decodeWorker[msg.name].postMessage(objData, [objData.data]);
				vm.planPt.decodeNum++;
			}
			if (vm.planPt.decodeNum <= 0) {
				vm.planPt.lastDecodeTime = Date.now();
			}
			//console.log("DecodeH265，decodeNum",vm.decodeNum);
		},
		// 解码并显示
		DecodeZip: function (msg) {
			if (msg.image.byteLength == 0) {
				return;
			}
			var objData = {
				command: kFeedBlockReq,
				data: msg.image,
				width: msg.width,
				height: msg.height,
				widthBytes: msg.widthBytes,
				canvasid: msg.name,
				layer: msg.layer,
				compressType: msg.compressType
			};
			if (this.decodeWorker[msg.name]) {
				this.decodeWorker[msg.name].postMessage(objData, [objData.data]);
			}
		},
		CreateWebGL: function (canvasId) {
			// var canvas = document.getElementById(canvasId)
			// // this.webglPlayer[canvasId] = canvas.transferControlToOffscreen(); // 改新的解码方式 zlb 22/1/21
			// this.webglPlayer[canvasId] = new WebGLPlayer(canvas, {
			//     preserveDrawingBuffer: false
			// });
			// console.log("CreateWebGL,canvas:", canvasId);
		},
		OnCreate: function () {
			// this.CreateWebGL("SplitTeethview");
			// this.initDecodeWorker("SplitTeethview");
			// this.CreateWebGL("RowTeethview");
			// this.initDecodeWorker("RowTeethview");
			// this.CreateWebGL("anteroposteriorView1");
			// this.initDecodeWorker("anteroposteriorView1");
			// this.CreateWebGL("anteroposteriorView2");
			// this.initDecodeWorker("anteroposteriorView2");
			// this.CreateWebGL("anteroposteriorView3");
			// this.initDecodeWorker("anteroposteriorView3");
			// this.planPt.open();
		},
		SetSize: function () {
			var vm = this;
			var url = execejArrUrl;
			param = {
				'command': comArray,
				'params': [{
					'command': comSetSize,//调整对象尺寸
					'winName': 'SplitTeethview',
					'width': vm.viewpicsize.SplitTeethview.width,
					'height': vm.viewpicsize.SplitTeethview.height
				},]
			};
			if (this.viewcontrastv || this.aftertwoview == "rowteeth") {
				param.params.push({
					'command': comSetSize,//调整对象尺寸
					'winName': 'RowTeethview',
					'width': vm.viewpicsize.RowTeethview.width,
					'height': vm.viewpicsize.RowTeethview.height
				})
			}
			if (this.curstep == 5 || this.curstep == 6) {
				param.params.push({
					'command': comSetSize,//调整对象尺寸
					'winName': 'anteroposteriorView1',
					'width': vm.viewpicsize.anteroposteriorView1.width,
					'height': vm.viewpicsize.anteroposteriorView1.height
				},
					{
						'command': comSetSize,//调整对象尺寸
						'winName': 'anteroposteriorView2',
						'width': vm.viewpicsize.anteroposteriorView2.width,
						'height': vm.viewpicsize.anteroposteriorView2.height
					},
					{
						'command': comSetSize,//调整对象尺寸
						'winName': 'anteroposteriorView3',
						'width': vm.viewpicsize.anteroposteriorView3.width,
						'height': vm.viewpicsize.anteroposteriorView3.height
					})
			} else {
				param.params = param.params.filter(ele => ele.winName === 'RowTeethview' || ele.winName === 'SplitTeethview')
			}

			console.log("SetSize, ", param);
			$.post(url, param, function (response) {
				if (parseInt(response.code) === 1) {
					console.log("SetSize response", response.info);
					//用在点击重新排牙按钮变成分牙窗口时 解决图像拉伸问题
					if (vm.adjorrerow.indexOf('rerow') != -1 && vm.modeltesttool) {
						vm.Excute({ 'command': 1066 })
					}
				} else {
					console.error("SetSize response", response.info);
				}
			});
		},
		onResize: function () {
			var self = this;
			this.toothIdMsg = false //窗口一缩放就隐藏牙齿编号圈圈
			let _w = $('.hv-mid').outerWidth(),
				_h = $('.hv-mid').outerHeight();
			let cw = Math.floor($('.hv-mid').outerWidth() / 2);
			this.view_w = $(".hv-mid").width();
			this.view_h = $(".hv-mid").height();

			cw = cw - cw % 4;
			_w = _w - _w % 4;
			_h = _h - _h % 4;

			self.viewpicsize.SplitTeethview.width = this.viewcontrastv ? cw : _w;
			self.viewpicsize.SplitTeethview.height = _h;

			self.viewpicsize.RowTeethview.width = this.aftertwoview == "rowteeth" ? _w : cw;
			self.viewpicsize.RowTeethview.height = _h;

			// 以下代码为新增迎合新码 2/1/21
			// var msg = {
			//     command: kSetSizeReq,
			//     width :  self.viewpicsize.SplitTeethview.width,
			//     height : self.viewpicsize.SplitTeethview.height
			// };
			// this.decodeWorker["SplitTeethview"].postMessage(msg);

			// var msg = {
			//     command: kSetSizeReq,
			//     width :  self.viewpicsize.RowTeethview.width,
			//     height : self.viewpicsize.RowTeethview.height
			// };
			// this.decodeWorker["RowTeethview"].postMessage(msg);


			// console.log(this.viewcontrastv,"子组件 viewcontrastv resize");
			if (this.planPt.isMain == 1) {
				this.SetSize();

			}
		},

	}
}
