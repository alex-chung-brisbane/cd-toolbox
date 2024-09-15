import { AccessibleIcon, Button, Card, DropdownMenu, Flex, Heading, HoverCard, IconButton, Kbd, Text, ScrollArea, SegmentedControl, Separator, Tooltip, Switch, Tabs, Box, TextField, Popover, Dialog, Inset, Em, Strong, Table, AlertDialog, Badge, Code, Grid } from '@radix-ui/themes';
import { HexColorPicker } from 'react-colorful';
import { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import { Bounce, toast, ToastContainer } from 'react-toastify';

import { ArrowTopRightIcon, BlendingModeIcon, BorderWidthIcon, ChevronLeftIcon, Cross2Icon, FontSizeIcon, FrameIcon, GearIcon, GroupIcon, ImageIcon, LayersIcon, LightningBoltIcon, ResetIcon, SlashIcon, SquareIcon, TextIcon, TrashIcon, ZoomInIcon, ZoomOutIcon } from '@radix-ui/react-icons';

import 'react-toastify/dist/ReactToastify.css';

let curImage: HTMLImageElement | null = null;
let curLayerID = 1;
const drawingSettingsDefaults: {
  drawing: boolean;
  tool: string | null;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  ctx: CanvasRenderingContext2D | null;
} = {
  drawing: false,
  tool: null,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  ctx: null,
};
let drawingSettings = structuredClone(drawingSettingsDefaults);

const Instructify = () => {
  let numberToolRef = useRef(null);
  let textToolRef = useRef(null);
  let fillToolRef = useRef(null);
  let rectangleToolRef = useRef(null);
  let arrowToolRef = useRef(null);
  let lineToolRef = useRef(null);

  const defaultTool = 'outline';
  const tools = [
    {
      id: 'number',
      icon: FrameIcon,
      title: 'Numbering tool',
      description: 'Insert step number (auto-increments each use).',
      key: 'n',
      ref: numberToolRef,
      onDraw: (ctx: CanvasRenderingContext2D) => {
        ctx.font = `700 ${fontSize}px Arial`;
        ctx.lineWidth = parseInt(lineSize);
        ctx.strokeStyle = lineColor;
        ctx.textRendering = 'geometricPrecision';
        ctx.fillStyle = fillColor;
        let measuredText = ctx.measureText(numberValue);
        ctx.beginPath();
        ctx.arc(drawingSettings.endX, drawingSettings.endY, Math.max(measuredText.width / 2, measuredText.actualBoundingBoxAscent - measuredText.actualBoundingBoxDescent) + 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.fillStyle = textColor;
        ctx.fillText(numberValue, Math.round(drawingSettings.endX) - measuredText.width / 2, Math.round(drawingSettings.endY) + (measuredText.actualBoundingBoxAscent + measuredText.actualBoundingBoxDescent) / 2);
      },
      onDone: (ctx: CanvasRenderingContext2D) => {
        setNumberValue((parseInt(numberValue) + 1).toString());
      },
    },
    {
      id: 'text',
      icon: TextIcon,
      title: 'Text tool',
      description: 'Insert text block (make sure to set the text in the options menu first).',
      key: 't',
      ref: textToolRef,
      onDraw: (ctx: CanvasRenderingContext2D) => {
        ctx.font = `700 ${fontSize}px Arial`;
        ctx.lineWidth = parseInt(lineSize);
        ctx.strokeStyle = lineColor;
        ctx.textRendering = 'geometricPrecision';
        ctx.fillStyle = fillColor;
        ctx.textRendering = 'geometricPrecision';
        const PADDING = 6;
        let measuredText = ctx.measureText(textValue);
        ctx.beginPath();
        ctx.fillRect(drawingSettings.endX - measuredText.width / 2 - PADDING, drawingSettings.endY - (measuredText.actualBoundingBoxAscent + measuredText.actualBoundingBoxDescent) / 2 - PADDING, measuredText.width + PADDING * 2, measuredText.actualBoundingBoxAscent + measuredText.actualBoundingBoxDescent + PADDING * 2);
        ctx.fillStyle = textColor;
        ctx.fillText(textValue, Math.round(drawingSettings.endX) - measuredText.width / 2, Math.round(drawingSettings.endY) + (measuredText.actualBoundingBoxAscent + measuredText.actualBoundingBoxDescent) / 2);
      },
      onDone: (ctx: CanvasRenderingContext2D) => {},
    },
    {
      id: 'fill',
      icon: SquareIcon,
      title: 'Filled rectangle',
      description: 'Draw a filled rectangle.',
      key: 'f',
      ref: fillToolRef,
      onDraw: (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = fillColor;
        let boundWidth = drawingSettings.endX - drawingSettings.startX;
        let boundHeight = drawingSettings.endY - drawingSettings.startY;

        let sourceX = boundWidth < 0 ? drawingSettings.endX : drawingSettings.startX;
        let sourceY = boundHeight < 0 ? drawingSettings.endY : drawingSettings.startY;

        if (boundWidth < 0) boundWidth *= -1;
        if (boundHeight < 0) boundHeight *= -1;

        ctx.fillRect(sourceX, sourceY, boundWidth, boundHeight);
      },
      onDone: (ctx: CanvasRenderingContext2D) => {},
    },
    {
      id: 'outline',
      icon: GroupIcon,
      title: 'Outlined rectangle',
      description: 'Draw an outlined rectangle.',
      key: 'r',
      ref: rectangleToolRef,
      onDraw: (ctx: CanvasRenderingContext2D) => {
        ctx.lineWidth = parseInt(lineSize);
        ctx.strokeStyle = lineColor;
        let boundWidth = drawingSettings.endX - drawingSettings.startX;
        let boundHeight = drawingSettings.endY - drawingSettings.startY;

        let sourceX = boundWidth < 0 ? drawingSettings.endX : drawingSettings.startX;
        let sourceY = boundHeight < 0 ? drawingSettings.endY : drawingSettings.startY;

        if (boundWidth < 0) boundWidth *= -1;
        if (boundHeight < 0) boundHeight *= -1;

        ctx.strokeRect(sourceX, sourceY, boundWidth, boundHeight);
      },
      onDone: (ctx: CanvasRenderingContext2D) => {},
    },
    {
      id: 'arrow',
      icon: ArrowTopRightIcon,
      title: 'Arrow',
      description: 'Draw an arrow (you can change arrow head length in the options menu).',
      key: 'a',
      ref: arrowToolRef,
      onDraw: (ctx: CanvasRenderingContext2D) => {
        ctx.lineWidth = parseInt(lineSize);
        ctx.strokeStyle = lineColor;
        ctx.beginPath();

        ctx.moveTo(drawingSettings.startX, drawingSettings.startY);
        ctx.lineTo(drawingSettings.endX, drawingSettings.endY);
        ctx.moveTo(drawingSettings.endX, drawingSettings.endY);

        let lineAngle = Math.atan2(drawingSettings.endY - drawingSettings.startY, drawingSettings.endX - drawingSettings.startX);
        const ARROW_HEAD_ANGLE = 5.5;
        const ARROW_LENGTH = parseInt(arrowheadSize);

        ctx.lineTo(drawingSettings.endX - ARROW_LENGTH * Math.cos(lineAngle - Math.PI / ARROW_HEAD_ANGLE), drawingSettings.endY - ARROW_LENGTH * Math.sin(lineAngle - Math.PI / ARROW_HEAD_ANGLE));
        ctx.moveTo(drawingSettings.endX, drawingSettings.endY);
        ctx.lineTo(drawingSettings.endX - ARROW_LENGTH * Math.cos(lineAngle + Math.PI / ARROW_HEAD_ANGLE), drawingSettings.endY - ARROW_LENGTH * Math.sin(lineAngle + Math.PI / ARROW_HEAD_ANGLE));

        ctx.stroke();
      },
      onDone: (ctx: CanvasRenderingContext2D) => {},
    },
    {
      id: 'line',
      icon: SlashIcon,
      title: 'Line',
      description: 'Draw a line.',
      key: 'l',
      ref: lineToolRef,
      onDraw: (ctx: CanvasRenderingContext2D) => {
        ctx.lineWidth = parseInt(lineSize);
        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        ctx.moveTo(drawingSettings.startX, drawingSettings.startY);
        ctx.lineTo(drawingSettings.endX, drawingSettings.endY);
        ctx.stroke();
      },
      onDone: (ctx: CanvasRenderingContext2D) => {},
    },
  ];
  const settingsDefaults = {
    textValue: "Set this text in 'Tool options' (top left).",
    numberValue: '1',
    lineSize: '2',
    arrowheadSize: '15',
    fontSize: '16',
    lineColor: {
      value: '#ff0000',
      readable: 'red',
    },
    fillColor: {
      value: '#000000',
      readable: 'black',
    },
    textColor: {
      value: '#ffffff',
      readable: 'white',
    },
  };

  let settingsDefaultFocusRef = useRef(null);
  let layersDefaultFocusRef = useRef(null);
  let [textValue, setTextValue] = useState(settingsDefaults.textValue);
  let [numberValue, setNumberValue] = useState(settingsDefaults.numberValue);
  let [lineSize, setLineSize] = useState(settingsDefaults.lineSize);
  let [arrowheadSize, setArrowheadSize] = useState(settingsDefaults.arrowheadSize);
  let [fontSize, setFontSize] = useState(settingsDefaults.fontSize);
  let [lineColor, setLineColor] = useState(settingsDefaults.lineColor.value);
  let [fillColor, setFillColor] = useState(settingsDefaults.fillColor.value);
  let [textColor, setTextColor] = useState(settingsDefaults.textColor.value);
  let [layerSize, setLayerSize] = useState({ width: 0, height: 0 });
  interface LayerProps {
    id: number;
    type: string;
  }
  let [layers, setLayers] = useState([] as LayerProps[]);

  let [menuDialogContent, setMenuDialogContent] = useState(<></>);

  let settingsBtnRef = useRef(null);
  let layersBtnRef = useRef(null);
  let zoomOutBtnRef = useRef(null);
  let zoomInBtnRef = useRef(null);
  const globalSingleKeyShortcuts = [
    {
      key: 's',
      button: settingsBtnRef.current,
      function: null,
    },
    {
      key: '\\',
      button: layersBtnRef.current,
      function: null,
    },
    {
      key: '[',
      button: zoomOutBtnRef.current,
      function: null,
    },
    {
      key: ']',
      button: zoomInBtnRef.current,
      function: null,
    },
    {
      key: 'c',
      button: null,
      function: () => {
        GenerateImg('copy');
      },
    },
  ];
  function ShortcutHandler(ev: KeyboardEvent): void {
    if ((ev.target as HTMLElement).nodeName === 'INPUT') return;

    globalSingleKeyShortcuts.forEach((shortcut) => {
      if (ev.key != shortcut.key) return;

      if (shortcut.button) (shortcut.button as HTMLButtonElement).click();
      if (shortcut.function) shortcut.function();
    });

    tools.forEach((tool) => {
      if (ev.key != tool.key) return;

      if (tool.ref.current) (tool.ref.current as HTMLButtonElement).click();
    });
  }
  useEffect(() => {
    document.addEventListener('keydown', ShortcutHandler);

    return () => {
      document.removeEventListener('keydown', ShortcutHandler);
    };
  }, [globalSingleKeyShortcuts]);

  function OnGlobalPaste(ev: ClipboardEvent): void {
    if ((ev.target as HTMLElement).nodeName === 'INPUT' && (ev.target as HTMLElement).id !== 'paste-image') return;

    if (!ev.clipboardData) return;
    if (ev.clipboardData.files.length > 0 && (ev.clipboardData.files[0].type === 'image/png' || ev.clipboardData.files[0].type === 'image/jpeg')) {
      if (curImage == null) LoadImage(ev.clipboardData.files[0]);
      else {
        const cachedImageData = ev.clipboardData.files[0];
        CustomConfirm('Override existing work?', "You've pasted an image, do you wish to load it? (This will override your existing work and is not reversible)").then((value) => {
          if (value) {
            LoadImage(cachedImageData);
          }
        });
      }
    }
  }
  useEffect(() => {
    document.addEventListener('paste', OnGlobalPaste);

    return () => {
      document.removeEventListener('paste', OnGlobalPaste);
    };
  });

  let editorWrapperRef = useRef(null);
  let [editorHeight, setEditorHeight] = useState(GetEditorHeight());
  function GetEditorHeight(): number {
    let totalHeight = window.innerHeight;
    let topY = editorWrapperRef.current ? (editorWrapperRef.current as HTMLDivElement).getBoundingClientRect().top : 0;
    return totalHeight - topY - 20 * 0.95;
  }
  function UpdateEditorHeight(): void {
    setEditorHeight(GetEditorHeight());
  }
  useEffect(() => {
    UpdateEditorHeight();
    window.addEventListener('load', UpdateEditorHeight);
    window.addEventListener('resize', UpdateEditorHeight);

    return () => {
      window.removeEventListener('load', UpdateEditorHeight);
      window.removeEventListener('resize', UpdateEditorHeight);
    };
  }, [editorWrapperRef]);

  let [visualLayerWidth, setVisualLayerWidth] = useState(0);
  function Zoom(direction: 'in' | 'out' | 'reset'): void {
    if (curImage == null) return;
    const zoomSpeed = 1.1;
    switch (direction) {
      case 'in':
        setVisualLayerWidth(visualLayerWidth * zoomSpeed);
        break;
      case 'out':
        setVisualLayerWidth(visualLayerWidth / zoomSpeed >= 35 ? visualLayerWidth / zoomSpeed : 35);
        break;
      case 'reset':
        setVisualLayerWidth(editorWrapperRef.current ? (editorWrapperRef.current as HTMLDivElement).getBoundingClientRect().width - 26 - 1 : 0);
        break;
    }
    return;
  }
  function ResetZoom(): void {
    Zoom('reset');
  }
  useEffect(() => {
    window.addEventListener('load', ResetZoom);

    return () => {
      window.removeEventListener('load', ResetZoom);
    };
  }, [editorWrapperRef]);

  let [customConfirmOpen, setCustomConfirmOpen] = useState(false);
  let [customConfirmTitle, setCustomConfirmTitle] = useState('');
  let [customConfirmDescription, setCustomConfirmDescription] = useState('');
  let [customConfirmAccept, setCustomConfirmAccept] = useState(() => {
    return () => {};
  });
  let [customConfirmDecline, setCustomConfirmDecline] = useState(() => {
    return () => {};
  });
  function CustomConfirm(title: string, description: string): Promise<boolean> {
    setCustomConfirmTitle(title);
    setCustomConfirmDescription(description);
    setCustomConfirmOpen(true);
    return new Promise((resolve) => {
      setCustomConfirmAccept(() => {
        return () => {
          resolve(true);
        };
      });
      setCustomConfirmDecline(() => {
        return () => {
          resolve(false);
        };
      });
    });
  }

  let [wipeSettings, setWipeSettings] = useState(false);
  const settingsMap = [
    {
      localStorageKey: 'line-size',
      setStateFunc: setLineSize,
      defaultValue: settingsDefaults.lineSize,
    },
    {
      localStorageKey: 'arrowhead-size',
      setStateFunc: setArrowheadSize,
      defaultValue: settingsDefaults.arrowheadSize,
    },
    {
      localStorageKey: 'font-size',
      setStateFunc: setFontSize,
      defaultValue: settingsDefaults.fontSize,
    },
    {
      localStorageKey: 'line-color',
      setStateFunc: setLineColor,
      defaultValue: settingsDefaults.lineColor.value,
    },
    {
      localStorageKey: 'fill-color',
      setStateFunc: setFillColor,
      defaultValue: settingsDefaults.fillColor.value,
    },
    {
      localStorageKey: 'text-color',
      setStateFunc: setTextColor,
      defaultValue: settingsDefaults.textColor.value,
    },
  ];
  function isLocalStorageAvailable(): boolean {
    const testKey = 'test-ls-availability';
    try {
      localStorage.setItem(testKey, testKey);
      if (localStorage.getItem(testKey) != testKey) throw new Error();
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      setWipeSettings(true);
      return;
    }

    if (localStorage.getItem('wipe-settings') == null) localStorage.setItem('wipe-settings', wipeSettings + '');
    else setWipeSettings(localStorage.getItem('wipe-settings') == 'true');

    if (wipeSettings) {
      settingsMap.forEach((setting) => {
        localStorage.setItem(setting.localStorageKey, setting.defaultValue);
      });
    } else {
      settingsMap.forEach((setting) => {
        if (localStorage.getItem(setting.localStorageKey) == null) localStorage.setItem(setting.localStorageKey, setting.defaultValue);
        setting.setStateFunc(localStorage.getItem(setting.localStorageKey) as string);
      });
    }
  });

  let bgImageCanvasRef = useRef(null);
  let interactionHandlerCanvasRef = useRef(null);

  function LoadImage(data: File) {
    curImage = new Image();
    curImage.addEventListener('load', () => {
      if (curImage) setLayerSize({ width: curImage.width, height: curImage.height });

      curLayerID = 1;
      setLayers([]);
      Zoom('reset');
    });

    let fr = new FileReader();
    fr.addEventListener('load', () => {
      if (fr.result && curImage) curImage.src = fr.result.toString();
    });
    fr.readAsDataURL(data);
  }
  useEffect(() => {
    const BG_IMG: HTMLCanvasElement | null = bgImageCanvasRef.current as unknown as HTMLCanvasElement;
    if (BG_IMG && curImage) {
      let BG_IMG_CTX = BG_IMG.getContext('2d');
      if (BG_IMG_CTX && curImage) BG_IMG_CTX.drawImage(curImage, 0, 0, curImage.width, curImage.height);
    }
  }, [layerSize]);

  let [curTool, setCurTool] = useState(defaultTool);
  let curLayerRef = useRef(null);
  function Draw(): void {
    if (!drawingSettings.drawing) return;
    if (drawingSettings.tool == null) return;
    tools.forEach((tool) => {
      if (tool.id !== drawingSettings.tool) return;
      if (!drawingSettings.ctx) return;
      if (!curImage) return;
      drawingSettings.ctx.clearRect(0, 0, curImage.width, curImage.height);
      tool.onDraw(drawingSettings.ctx);
    });
  }
  function Done(): void {
    Draw();
    tools.forEach((tool) => {
      if (tool.id !== drawingSettings.tool) return;
      if (!drawingSettings.ctx) return;
      tool.onDone(drawingSettings.ctx);
    });
    drawingSettings = structuredClone(drawingSettingsDefaults);
  }
  function InteractionMouseDown(ev: MouseEvent) {
    if (drawingSettings.drawing) Done();
    drawingSettings.drawing = true;
    drawingSettings.tool = curTool;
    if (interactionHandlerCanvasRef.current == null) return;
    drawingSettings.startX = drawingSettings.endX = drawingSettings.endX = Math.round(ev.offsetX * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).width / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetWidth) * 10) / 10;
    drawingSettings.startY = drawingSettings.endY = drawingSettings.endY = Math.round(ev.offsetY * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).height / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetHeight) * 10) / 10;
    setLayers([
      ...layers,
      {
        id: curLayerID,
        type: (
          tools.find((obj) => {
            return obj.id === curTool;
          }) as any
        ).title,
      },
    ]);
    curLayerID++;
    Draw();
  }
  useEffect(() => {
    if (curLayerRef.current) drawingSettings.ctx = (curLayerRef.current as unknown as HTMLCanvasElement).getContext('2d');
  });
  function InteractionMouseMove(ev: MouseEvent) {
    if (!drawingSettings.drawing) return;
    if (interactionHandlerCanvasRef.current == null) return;
    drawingSettings.endX = Math.round(ev.offsetX * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).width / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetWidth) * 10) / 10;
    drawingSettings.endY = Math.round(ev.offsetY * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).height / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetHeight) * 10) / 10;
    Draw();
  }
  function InteractionTouchStart(ev: TouchEvent) {
    if (ev.touches.length !== 2) return;
    ev.preventDefault();

    if (drawingSettings.drawing) Done();
    drawingSettings.drawing = true;
    drawingSettings.tool = curTool;
    if (interactionHandlerCanvasRef.current == null) return;
    drawingSettings.startX = Math.round((ev.touches[0].pageX - (interactionHandlerCanvasRef.current as HTMLCanvasElement).getBoundingClientRect().x) * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).width / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetWidth) * 10) / 10;
    drawingSettings.startY = Math.round((ev.touches[0].pageY - (interactionHandlerCanvasRef.current as HTMLCanvasElement).getBoundingClientRect().y) * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).height / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetHeight) * 10) / 10;
    drawingSettings.endX = Math.round((ev.touches[1].pageX - (interactionHandlerCanvasRef.current as HTMLCanvasElement).getBoundingClientRect().x) * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).width / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetWidth) * 10) / 10;
    drawingSettings.endY = Math.round((ev.touches[1].pageY - (interactionHandlerCanvasRef.current as HTMLCanvasElement).getBoundingClientRect().y) * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).height / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetHeight) * 10) / 10;
    setLayers([
      ...layers,
      {
        id: curLayerID,
        type: (
          tools.find((obj) => {
            return obj.id === curTool;
          }) as any
        ).title,
      },
    ]);
    curLayerID++;
    Draw();
  }
  function InteractionTouchChange(ev: TouchEvent) {
    if (ev.touches.length !== 2) {
      Done();
      return;
    }
    ev.preventDefault();

    if (!drawingSettings.drawing) Done();
    drawingSettings.drawing = true;
    drawingSettings.tool = curTool;
    if (interactionHandlerCanvasRef.current == null) return;
    drawingSettings.startX = Math.round((ev.touches[0].pageX - (interactionHandlerCanvasRef.current as HTMLCanvasElement).getBoundingClientRect().x) * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).width / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetWidth) * 10) / 10;
    drawingSettings.startY = Math.round((ev.touches[0].pageY - (interactionHandlerCanvasRef.current as HTMLCanvasElement).getBoundingClientRect().y) * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).height / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetHeight) * 10) / 10;
    drawingSettings.endX = Math.round((ev.touches[1].pageX - (interactionHandlerCanvasRef.current as HTMLCanvasElement).getBoundingClientRect().x) * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).width / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetWidth) * 10) / 10;
    drawingSettings.endY = Math.round((ev.touches[1].pageY - (interactionHandlerCanvasRef.current as HTMLCanvasElement).getBoundingClientRect().y) * ((interactionHandlerCanvasRef.current as HTMLCanvasElement).height / (interactionHandlerCanvasRef.current as HTMLCanvasElement).offsetHeight) * 10) / 10;
    Draw();
  }
  useEffect(() => {
    if (interactionHandlerCanvasRef.current) {
      (interactionHandlerCanvasRef.current as HTMLCanvasElement).addEventListener('mousedown', InteractionMouseDown);
      (interactionHandlerCanvasRef.current as HTMLCanvasElement).addEventListener('mousemove', InteractionMouseMove);
      (interactionHandlerCanvasRef.current as HTMLCanvasElement).addEventListener('mouseup', Done);
      (interactionHandlerCanvasRef.current as HTMLCanvasElement).addEventListener('mouseleave', Done);
      (interactionHandlerCanvasRef.current as HTMLCanvasElement).addEventListener('touchstart', InteractionTouchStart);
      (interactionHandlerCanvasRef.current as HTMLCanvasElement).addEventListener('touchmove', InteractionTouchChange);
      (interactionHandlerCanvasRef.current as HTMLCanvasElement).addEventListener('touchcancel', InteractionTouchChange);
      (interactionHandlerCanvasRef.current as HTMLCanvasElement).addEventListener('touchend', InteractionTouchChange);
    }

    return () => {
      if (interactionHandlerCanvasRef.current) {
        (interactionHandlerCanvasRef.current as HTMLCanvasElement).removeEventListener('mousedown', InteractionMouseDown);
        (interactionHandlerCanvasRef.current as HTMLCanvasElement).removeEventListener('mousemove', InteractionMouseMove);
        (interactionHandlerCanvasRef.current as HTMLCanvasElement).removeEventListener('mouseup', Done);
        (interactionHandlerCanvasRef.current as HTMLCanvasElement).removeEventListener('mouseleave', Done);
        (interactionHandlerCanvasRef.current as HTMLCanvasElement).removeEventListener('touchstart', InteractionTouchStart);
        (interactionHandlerCanvasRef.current as HTMLCanvasElement).removeEventListener('touchmove', InteractionTouchChange);
        (interactionHandlerCanvasRef.current as HTMLCanvasElement).removeEventListener('touchcancel', InteractionTouchChange);
        (interactionHandlerCanvasRef.current as HTMLCanvasElement).removeEventListener('touchend', InteractionTouchChange);
      }
    };
  });

  function GenerateImg(action: 'download' | 'copy') {
    if (curImage == null) return;
    let exportCanvas = document.createElement('canvas');
    exportCanvas.width = curImage.width;
    exportCanvas.height = curImage.height;
    let exportCanvas_ctx = exportCanvas.getContext('2d');
    Array.from(document.querySelectorAll('#editor > canvas')).forEach((el) => {
      if (exportCanvas_ctx && curImage) exportCanvas_ctx.drawImage(el as HTMLCanvasElement, 0, 0, curImage.width, curImage.height);
    });
    switch (action) {
      case 'download':
        exportCanvas.toBlob(
          function (blob) {
            if (blob) saveAs(blob, 'Instructify export.jpg');
          },
          'image/jpeg',
          1
        );
        break;
      case 'copy':
        exportCanvas.toBlob((blob) => {
          if (blob) {
            let data = [new ClipboardItem({ [blob.type]: blob })];
            navigator.clipboard
              .write(data)
              .then(() => {
                toast.success('Copied to clipboard!', {
                  position: 'bottom-center',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnFocusLoss: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: 'dark',
                  transition: Bounce,
                });
              })
              .catch(() => {
                toast.error("Couldn't write to clipboard, does this page have permission?", {
                  position: 'bottom-center',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnFocusLoss: false,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: 'dark',
                  transition: Bounce,
                });
              });
          }
        });
        break;
      default:
        break;
    }
    exportCanvas.remove();
  }

  return (
    <Flex
      direction="column"
      gap="1"
    >
      {/* Custom confirmation dialog */}
      <AlertDialog.Root
        open={customConfirmOpen}
        onOpenChange={setCustomConfirmOpen}
      >
        <AlertDialog.Content
          maxWidth="450px"
          onEscapeKeyDown={customConfirmDecline}
        >
          <AlertDialog.Title>{customConfirmTitle}</AlertDialog.Title>
          <AlertDialog.Description size="3">{customConfirmDescription}</AlertDialog.Description>
          <Flex
            gap="3"
            mt="4"
            justify="end"
          >
            <AlertDialog.Cancel>
              <Button
                variant="soft"
                color="gray"
                onClick={customConfirmDecline}
              >
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                color="red"
                onClick={customConfirmAccept}
              >
                Continue
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <Flex
        direction={{ initial: 'column', xs: 'row' }}
        justify="center"
        align="center"
        gapX="3"
        gapY="2"
      >
        <Card
          style={{ flexShrink: '0' }}
          mb="2"
        >
          <Flex
            direction="row"
            gap="2"
            justify="center"
            align="center"
            wrap="wrap"
          >
            {/* File menu */}
            <Dialog.Root>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button
                    variant="soft"
                    size={{ initial: '2', xs: '1' }}
                    accessKey="m"
                  >
                    File
                    <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content size={{ initial: '2', xs: '1' }}>
                  {/* Load from file */}
                  <Dialog.Trigger>
                    <DropdownMenu.Item
                      onSelect={() => {
                        setMenuDialogContent(
                          <Dialog.Content maxWidth="450px">
                            <Dialog.Title>Load from file</Dialog.Title>
                            <Dialog.Description size="2">Your image will stay on your device. Nothing will be logged and it won't be sent to the server.</Dialog.Description>
                            <Inset
                              side="x"
                              my="4"
                            >
                              <Separator size="4" />
                            </Inset>
                            <style>
                              {`
                              #file-import {
                                border-radius: var(--radius-3);
                                box-shadow: inset 0 0 0 1px var(--gray-a7);
                                background-color: var(--color-surface);
                                padding: calc(var(--space-3)  - 1px);
                              }

                              #file-import:focus {
                                outline: 2px solid var(--focus-8);
                                outline-offset: -1px;
                              }

                              #file-import::file-selector-button {
                                border: 0;
                                border-radius: var(--radius-3);
                                margin-right: var(--space-2);
                              }
                              `}
                            </style>
                            <input
                              type="file"
                              name="file-import"
                              id="file-import"
                              className="rt-reset"
                              accept="image/png,image/jpg,image/jpeg"
                              onChange={(ev) => {
                                let files = ev.target.files;
                                if (files && files.length)
                                  if (curImage == null) LoadImage(files[0]);
                                  else
                                    CustomConfirm('Override existing work?', 'Loading a new image will override your existing work.').then((value) => {
                                      if (value) {
                                        LoadImage(files[0]);
                                      } else {
                                        ev.target.value = '';
                                      }
                                    });
                              }}
                            />
                            <Flex
                              gap="3"
                              mt="4"
                              justify="end"
                              wrap="wrap-reverse"
                            >
                              <Dialog.Close>
                                <Button variant="soft">Close</Button>
                              </Dialog.Close>
                            </Flex>
                          </Dialog.Content>
                        );
                      }}
                    >
                      Load from file
                    </DropdownMenu.Item>
                  </Dialog.Trigger>
                  {/* Load from clipboard */}
                  <Dialog.Trigger>
                    <DropdownMenu.Item
                      shortcut="⌘ V"
                      onSelect={() => {
                        setMenuDialogContent(
                          <Dialog.Content maxWidth="450px">
                            <Dialog.Title>Load from clipboard</Dialog.Title>
                            <Dialog.Description size="2">
                              This option is only useful for <Strong>Mobile</Strong> users. <Strong>Desktop</Strong> users can <Em>Paste</Em> <Kbd>⌘ V</Kbd> an image anywhere on the page to load it.
                            </Dialog.Description>
                            <Inset
                              side="x"
                              my="4"
                            >
                              <Separator size="4" />
                            </Inset>
                            <TextField.Root
                              placeholder="Paste your image here"
                              size="3"
                              id="paste-image"
                              radius="medium"
                            >
                              <TextField.Slot>
                                <ImageIcon
                                  height="16"
                                  width="16"
                                />
                              </TextField.Slot>
                            </TextField.Root>
                            <Flex
                              gap="3"
                              mt="4"
                              justify="end"
                              wrap="wrap-reverse"
                            >
                              <Dialog.Close>
                                <Button variant="soft">Close</Button>
                              </Dialog.Close>
                            </Flex>
                          </Dialog.Content>
                        );
                      }}
                    >
                      Load from clipboard
                    </DropdownMenu.Item>
                  </Dialog.Trigger>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={() => {
                      GenerateImg('download');
                    }}
                  >
                    Export to file
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    shortcut="C"
                    accessKey="c"
                    onClick={() => {
                      GenerateImg('copy');
                    }}
                  >
                    Export to clipboard
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  {/* Help */}
                  <Dialog.Trigger>
                    <DropdownMenu.Item
                      onSelect={() => {
                        setMenuDialogContent(
                          <Dialog.Content maxWidth="520px">
                            <Dialog.Title>Help</Dialog.Title>
                            <Dialog.Description size="2">Instructify helps you quickly add simple instructional markup to images.</Dialog.Description>
                            <Inset
                              side="x"
                              my="4"
                            >
                              <Separator size="4" />
                            </Inset>
                            <ScrollArea
                              type="hover"
                              scrollbars="vertical"
                              style={{ maxHeight: 'calc(100dvh - (5 * var(--space-9)))' }}
                            >
                              <Box pr="4">
                                <Heading
                                  as="h2"
                                  size="3"
                                >
                                  Getting started
                                </Heading>
                                <Text
                                  as="p"
                                  size="2"
                                  mt="2"
                                >
                                  There are two ways to import images, from your disk or from your clipboard.
                                </Text>
                                <Text
                                  as="p"
                                  size="2"
                                  mt="2"
                                >
                                  Use the <Badge variant="soft">File</Badge> menu to load an image from your device, otherwise you can <Em>Paste</Em> anywhere on the page to load an image from your clipboard.
                                </Text>
                                <Text
                                  as="p"
                                  size="2"
                                  mt="2"
                                >
                                  <Strong>Your inputs will remain on your device.</Strong>
                                </Text>
                                <Heading
                                  as="h2"
                                  size="3"
                                  mt="5"
                                >
                                  Tools
                                </Heading>
                                <Grid
                                  mt="2"
                                  columns={{ initial: '1fr', xs: '1fr 1fr' }}
                                  gap="2"
                                >
                                  {tools.map((tool) => {
                                    return (
                                      <Card key={tool.id}>
                                        <Flex
                                          direction="row"
                                          gap="2"
                                          align="center"
                                          justify="start"
                                          wrap="wrap"
                                        >
                                          <tool.icon
                                            height="16"
                                            width="16"
                                          />
                                          <Heading
                                            as="h3"
                                            size="3"
                                          >
                                            {tool.title}
                                          </Heading>
                                          <Text
                                            as="label"
                                            align="right"
                                            ml="auto"
                                          >
                                            <Kbd>{tool.key.toUpperCase()}</Kbd>
                                          </Text>
                                        </Flex>
                                        <Separator
                                          size="4"
                                          my="2"
                                        />
                                        <Text as="p">{tool.description}</Text>
                                      </Card>
                                    );
                                  })}
                                </Grid>
                                <Heading
                                  as="h2"
                                  size="3"
                                  mt="5"
                                >
                                  Exporting
                                </Heading>
                                <Text
                                  as="p"
                                  size="2"
                                  mt="2"
                                >
                                  Similar to importing, you have two options for exporting your marked-up image. You can download as a <Code variant="outline">JPG</Code> to your device (see <Badge variant="soft">File</Badge> menu) or export directly to your clipboard.
                                </Text>
                              </Box>
                            </ScrollArea>
                            <Flex
                              gap="3"
                              mt="4"
                              justify="end"
                              wrap="wrap-reverse"
                            >
                              <Dialog.Close>
                                <Button variant="soft">Close</Button>
                              </Dialog.Close>
                            </Flex>
                          </Dialog.Content>
                        );
                      }}
                    >
                      Help
                    </DropdownMenu.Item>
                  </Dialog.Trigger>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              {menuDialogContent}
            </Dialog.Root>
            <Separator orientation="vertical" />
            {/* Tool options */}
            <Dialog.Root>
              <Tooltip
                content={
                  <>
                    Tool options <Kbd ml="1">S</Kbd>
                  </>
                }
              >
                <Dialog.Trigger>
                  <IconButton
                    radius="full"
                    size={{ initial: '2', xs: '1' }}
                    variant="soft"
                    accessKey="s"
                    ref={settingsBtnRef}
                  >
                    <AccessibleIcon label={'Settings'}>
                      <GearIcon />
                    </AccessibleIcon>
                  </IconButton>
                </Dialog.Trigger>
              </Tooltip>{' '}
              <Dialog.Content
                maxWidth="450px"
                onOpenAutoFocus={(ev) => {
                  ev.preventDefault();
                  if (settingsDefaultFocusRef.current) (settingsDefaultFocusRef.current as HTMLElement).focus();
                }}
              >
                <Dialog.Title>Tool options</Dialog.Title>
                <Dialog.Description size="2">
                  <Switch
                    id="persistant-options"
                    mr="2"
                    variant="soft"
                    size="1"
                    defaultChecked={wipeSettings}
                    onCheckedChange={(val) => {
                      setWipeSettings(val);
                      localStorage.setItem('wipe-settings', val + '');
                    }}
                  />
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                      <Text
                        as="label"
                        htmlFor="persistant-options"
                      >
                        Reset settings each time you visit.
                      </Text>
                    </HoverCard.Trigger>
                    <HoverCard.Content
                      size="1"
                      maxWidth="240px"
                    >
                      <Text
                        as="p"
                        size="1"
                      >
                        For convenience, Instructify will save your <Em>Sizes</Em> and <Em>Colors</Em> settings to your browser's local storage so that they stay the same between sessions. You can override this behaviour by checking this option.
                      </Text>
                    </HoverCard.Content>
                  </HoverCard.Root>
                </Dialog.Description>
                <Box
                  as="div"
                  mb="2"
                ></Box>
                <Inset
                  side="x"
                  my="2"
                >
                  <Tabs.Root defaultValue="values">
                    <Tabs.List ref={settingsDefaultFocusRef}>
                      <Tabs.Trigger value="values">Values</Tabs.Trigger>
                      <Tabs.Trigger value="sizes">Sizes</Tabs.Trigger>
                      <Tabs.Trigger value="colors">Colors</Tabs.Trigger>
                    </Tabs.List>
                    <Box mt="3">
                      <Tabs.Content
                        value="values"
                        tabIndex={-1}
                      >
                        <Flex
                          px="3"
                          direction="column"
                          gap="4"
                        >
                          <Card>
                            <Text
                              as="label"
                              size="3"
                              htmlFor="text-tool-value"
                            >
                              Text tool value
                            </Text>
                            <TextField.Root
                              placeholder="No value set"
                              size="2"
                              value={textValue}
                              onChange={(ev) => {
                                setTextValue(ev.target.value);
                              }}
                              autoComplete="off"
                              mt="2"
                              id="text-tool-value"
                              radius="medium"
                            >
                              <TextField.Slot>
                                <TextIcon
                                  height="16"
                                  width="16"
                                />
                              </TextField.Slot>
                              <TextField.Slot>
                                <Tooltip content="Clear">
                                  <IconButton
                                    size="1"
                                    variant="ghost"
                                    onClick={() => {
                                      setTextValue('');
                                    }}
                                  >
                                    <Cross2Icon
                                      height="14"
                                      width="14"
                                    />
                                  </IconButton>
                                </Tooltip>
                              </TextField.Slot>
                            </TextField.Root>
                          </Card>
                          <Card>
                            <Text
                              as="label"
                              size="3"
                              htmlFor="number-tool-value"
                            >
                              Number tool value
                            </Text>
                            <TextField.Root
                              size="2"
                              value={numberValue}
                              onChange={(ev) => {
                                setNumberValue(parseInt(ev.target.value));
                              }}
                              min={1}
                              step={1}
                              type="number"
                              mt="2"
                              id="number-tool-value"
                              radius="medium"
                            >
                              <TextField.Slot>
                                <LightningBoltIcon
                                  height="16"
                                  width="16"
                                />
                              </TextField.Slot>
                              <TextField.Slot>
                                <Tooltip content={`Reset to default (${settingsDefaults.numberValue})`}>
                                  <IconButton
                                    size="1"
                                    variant="ghost"
                                    onClick={() => {
                                      setNumberValue(settingsDefaults.numberValue);
                                    }}
                                  >
                                    <ResetIcon
                                      height="14"
                                      width="14"
                                    />
                                  </IconButton>
                                </Tooltip>
                              </TextField.Slot>
                            </TextField.Root>
                          </Card>
                        </Flex>
                      </Tabs.Content>
                      <Tabs.Content
                        value="sizes"
                        tabIndex={-1}
                      >
                        <Flex
                          px="3"
                          direction="column"
                          gap="4"
                        >
                          <Card>
                            <Text
                              as="label"
                              size="3"
                              htmlFor="line-size"
                            >
                              Line width (px)
                            </Text>
                            <TextField.Root
                              size="2"
                              value={lineSize}
                              onChange={(ev) => {
                                localStorage.setItem('line-size', ev.target.value);
                                setLineSize(ev.target.value);
                              }}
                              min={1}
                              step={1}
                              type="number"
                              mt="2"
                              id="line-size"
                              radius="medium"
                            >
                              <TextField.Slot>
                                <BorderWidthIcon
                                  height="16"
                                  width="16"
                                />
                              </TextField.Slot>
                              <TextField.Slot>
                                <Tooltip content={`Reset to default (${settingsDefaults.lineSize}px)`}>
                                  <IconButton
                                    size="1"
                                    variant="ghost"
                                    onClick={() => {
                                      localStorage.setItem('line-size', settingsDefaults.lineSize);
                                      setLineSize(settingsDefaults.lineSize);
                                    }}
                                  >
                                    <ResetIcon
                                      height="14"
                                      width="14"
                                    />
                                  </IconButton>
                                </Tooltip>
                              </TextField.Slot>
                            </TextField.Root>
                          </Card>
                          <Card>
                            <Text
                              as="label"
                              size="3"
                              htmlFor="arrowhead-size"
                            >
                              Arrow head length (px)
                            </Text>
                            <TextField.Root
                              size="2"
                              value={arrowheadSize}
                              onChange={(ev) => {
                                localStorage.setItem('arrowhead-size', ev.target.value);
                                setArrowheadSize(ev.target.value);
                              }}
                              min={1}
                              step={1}
                              type="number"
                              mt="2"
                              id="arrowhead-size"
                              radius="medium"
                            >
                              <TextField.Slot>
                                <ChevronLeftIcon
                                  height="16"
                                  width="16"
                                />
                              </TextField.Slot>
                              <TextField.Slot>
                                <Tooltip content={`Reset to default (${settingsDefaults.arrowheadSize}px)`}>
                                  <IconButton
                                    size="1"
                                    variant="ghost"
                                    onClick={() => {
                                      localStorage.setItem('arrowhead-size', settingsDefaults.arrowheadSize);
                                      setArrowheadSize(settingsDefaults.arrowheadSize);
                                    }}
                                  >
                                    <ResetIcon
                                      height="14"
                                      width="14"
                                    />
                                  </IconButton>
                                </Tooltip>
                              </TextField.Slot>
                            </TextField.Root>
                          </Card>
                          <Card>
                            <Text
                              as="label"
                              size="3"
                              htmlFor="font-size"
                            >
                              Font size (px)
                            </Text>
                            <TextField.Root
                              size="2"
                              value={fontSize}
                              onChange={(ev) => {
                                localStorage.setItem('font-size', ev.target.value);
                                setFontSize(ev.target.value);
                              }}
                              min={1}
                              step={1}
                              type="number"
                              mt="2"
                              id="font-size"
                              radius="medium"
                            >
                              <TextField.Slot>
                                <FontSizeIcon
                                  height="16"
                                  width="16"
                                />
                              </TextField.Slot>
                              <TextField.Slot>
                                <Tooltip content={`Reset to default (${settingsDefaults.fontSize}px)`}>
                                  <IconButton
                                    size="1"
                                    variant="ghost"
                                    onClick={() => {
                                      localStorage.setItem('font-size', settingsDefaults.fontSize);
                                      setFontSize(settingsDefaults.fontSize);
                                    }}
                                  >
                                    <ResetIcon
                                      height="14"
                                      width="14"
                                    />
                                  </IconButton>
                                </Tooltip>
                              </TextField.Slot>
                            </TextField.Root>
                          </Card>
                        </Flex>
                      </Tabs.Content>
                      <Tabs.Content
                        value="colors"
                        tabIndex={-1}
                      >
                        <Flex
                          px="3"
                          direction="column"
                          gap="4"
                        >
                          <Card>
                            <Flex
                              direction="row"
                              align="center"
                              minWidth="max-content"
                              gap="2"
                              justify="between"
                            >
                              <Text
                                as="label"
                                size="3"
                              >
                                Line color
                              </Text>
                              <Box
                                style={{ backgroundColor: lineColor, borderRadius: 'var(--radius-2)' }}
                                minWidth="2rem"
                                flexGrow="1"
                                height="100%"
                              >
                                <Text
                                  as="span"
                                  aria-hidden="true"
                                  style={{ userSelect: 'none' }}
                                >
                                  &nbsp;
                                </Text>
                              </Box>
                              <Popover.Root>
                                <Tooltip content="Choose color">
                                  <Popover.Trigger>
                                    <IconButton
                                      radius="medium"
                                      variant="soft"
                                    >
                                      <BlendingModeIcon />
                                    </IconButton>
                                  </Popover.Trigger>
                                </Tooltip>
                                <Popover.Content>
                                  <Box m="3">
                                    <HexColorPicker
                                      color={lineColor}
                                      onChange={(val) => {
                                        localStorage.setItem('line-color', val);
                                        setLineColor(val);
                                      }}
                                    />
                                  </Box>
                                </Popover.Content>
                              </Popover.Root>
                              <Tooltip content={`Reset to default (${settingsDefaults.lineColor.readable})`}>
                                <IconButton
                                  radius="medium"
                                  variant="soft"
                                  onClick={() => {
                                    localStorage.setItem('line-color', settingsDefaults.lineColor.value);
                                    setLineColor(settingsDefaults.lineColor.value);
                                  }}
                                >
                                  <ResetIcon />
                                </IconButton>
                              </Tooltip>
                            </Flex>
                          </Card>
                          <Card>
                            <Flex
                              direction="row"
                              align="center"
                              minWidth="max-content"
                              gap="2"
                              justify="between"
                            >
                              <Text
                                as="label"
                                size="3"
                              >
                                Fill color
                              </Text>
                              <Box
                                style={{ backgroundColor: fillColor, borderRadius: 'var(--radius-2)' }}
                                minWidth="2rem"
                                flexGrow="1"
                                height="100%"
                              >
                                <Text
                                  as="span"
                                  aria-hidden="true"
                                  style={{ userSelect: 'none' }}
                                >
                                  &nbsp;
                                </Text>
                              </Box>
                              <Popover.Root>
                                <Tooltip content="Choose color">
                                  <Popover.Trigger>
                                    <IconButton
                                      radius="medium"
                                      variant="soft"
                                    >
                                      <BlendingModeIcon />
                                    </IconButton>
                                  </Popover.Trigger>
                                </Tooltip>
                                <Popover.Content>
                                  <Box m="3">
                                    <HexColorPicker
                                      color={fillColor}
                                      onChange={(val) => {
                                        localStorage.setItem('fill-color', val);
                                        setFillColor(val);
                                      }}
                                    />
                                  </Box>
                                </Popover.Content>
                              </Popover.Root>
                              <Tooltip content={`Reset to default (${settingsDefaults.fillColor.readable})`}>
                                <IconButton
                                  radius="medium"
                                  variant="soft"
                                  onClick={() => {
                                    localStorage.setItem('fill-color', settingsDefaults.fillColor.value);
                                    setFillColor(settingsDefaults.fillColor.value);
                                  }}
                                >
                                  <ResetIcon />
                                </IconButton>
                              </Tooltip>
                            </Flex>
                          </Card>
                          <Card>
                            <Flex
                              direction="row"
                              align="center"
                              minWidth="max-content"
                              gap="2"
                              justify="between"
                            >
                              <Text
                                as="label"
                                size="3"
                              >
                                Text color
                              </Text>
                              <Box
                                style={{ backgroundColor: textColor, borderRadius: 'var(--radius-2)' }}
                                minWidth="2rem"
                                flexGrow="1"
                                height="100%"
                              >
                                <Text
                                  as="span"
                                  aria-hidden="true"
                                  style={{ userSelect: 'none' }}
                                >
                                  &nbsp;
                                </Text>
                              </Box>
                              <Popover.Root>
                                <Tooltip content="Choose color">
                                  <Popover.Trigger>
                                    <IconButton
                                      radius="medium"
                                      variant="soft"
                                    >
                                      <BlendingModeIcon />
                                    </IconButton>
                                  </Popover.Trigger>
                                </Tooltip>
                                <Popover.Content>
                                  <Box m="3">
                                    <HexColorPicker
                                      color={textColor}
                                      onChange={(val) => {
                                        localStorage.setItem('text-color', val);
                                        setTextColor(val);
                                      }}
                                    />
                                  </Box>
                                </Popover.Content>
                              </Popover.Root>
                              <Tooltip content={`Reset to default (${settingsDefaults.textColor.readable})`}>
                                <IconButton
                                  radius="medium"
                                  variant="soft"
                                  onClick={() => {
                                    localStorage.setItem('text-color', settingsDefaults.textColor.value);
                                    setTextColor(settingsDefaults.textColor.value);
                                  }}
                                >
                                  <ResetIcon />
                                </IconButton>
                              </Tooltip>
                            </Flex>
                          </Card>
                        </Flex>
                      </Tabs.Content>
                    </Box>
                  </Tabs.Root>
                </Inset>
                <Flex
                  gap="3"
                  mt="4"
                  justify="end"
                  wrap="wrap-reverse"
                >
                  <Dialog.Close>
                    <Button>Done</Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
            {/* Manage layers */}
            <Dialog.Root>
              <Tooltip
                content={
                  <>
                    Manage layers <Kbd ml="1">\</Kbd>
                  </>
                }
              >
                <Dialog.Trigger>
                  <IconButton
                    radius="full"
                    size={{ initial: '2', xs: '1' }}
                    variant="soft"
                    accessKey="\"
                    ref={layersBtnRef}
                  >
                    <AccessibleIcon label={'Layers'}>
                      <LayersIcon />
                    </AccessibleIcon>
                  </IconButton>
                </Dialog.Trigger>
              </Tooltip>{' '}
              <Dialog.Content
                maxWidth="450px"
                onOpenAutoFocus={(ev) => {
                  ev.preventDefault();
                  if (layersDefaultFocusRef.current) (layersDefaultFocusRef.current as HTMLElement).focus();
                }}
              >
                <Dialog.Title>Manage layers</Dialog.Title>
                <Dialog.Description size="2">
                  <Text
                    as="label"
                    htmlFor="persistant-options"
                  >
                    Each time you add markup to your image, a layer is created.
                  </Text>
                </Dialog.Description>
                <Box
                  as="div"
                  mb="2"
                ></Box>
                <Inset
                  side="x"
                  my="2"
                >
                  <ScrollArea
                    type="hover"
                    scrollbars="vertical"
                    style={{ maxHeight: 'calc(100dvh - (5 * var(--space-9)))', minHeight: 'calc(2 * var(--space-9))' }}
                  >
                    <Table.Root size="1">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell justify="end">Actions</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {layers
                          .slice(0)
                          .reverse()
                          .map((layer, index) => {
                            return (
                              <Table.Row
                                align="center"
                                key={layer.id}
                              >
                                <Table.RowHeaderCell>{layer.id}</Table.RowHeaderCell>
                                <Table.Cell>{layer.type}</Table.Cell>
                                <Table.Cell justify="end">
                                  <Tooltip content="Remove layer">
                                    <IconButton
                                      radius="large"
                                      variant="soft"
                                      color="red"
                                      onClick={() => {
                                        let tmpLayers = layers.slice(0);
                                        tmpLayers.splice(layers.length - (index + 1), 1);
                                        setLayers(tmpLayers);
                                      }}
                                    >
                                      <TrashIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                      </Table.Body>
                    </Table.Root>
                  </ScrollArea>
                </Inset>
                <Flex
                  gap="3"
                  mt="4"
                  justify="end"
                  wrap="wrap-reverse"
                >
                  <Dialog.Close>
                    <Button ref={layersDefaultFocusRef}>Done</Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
            <Separator orientation="vertical" />
            {/* Zoom out */}
            <Tooltip
              content={
                <>
                  Zoom out <Kbd ml="1">[</Kbd>
                </>
              }
            >
              <IconButton
                radius="full"
                size={{ initial: '2', xs: '1' }}
                variant="soft"
                accessKey="["
                onClick={() => {
                  Zoom('out');
                }}
                ref={zoomOutBtnRef}
              >
                <AccessibleIcon label={'Zoom out'}>
                  <ZoomOutIcon />
                </AccessibleIcon>
              </IconButton>
            </Tooltip>
            {/* Zoom in */}
            <Tooltip
              content={
                <>
                  Zoom in <Kbd ml="1">]</Kbd>
                </>
              }
            >
              <IconButton
                radius="full"
                size={{ initial: '2', xs: '1' }}
                variant="soft"
                accessKey="]"
                onClick={() => {
                  Zoom('in');
                }}
                ref={zoomInBtnRef}
              >
                <AccessibleIcon label={'Zoom in'}>
                  <ZoomInIcon />
                </AccessibleIcon>
              </IconButton>
            </Tooltip>
          </Flex>
        </Card>
        {/* Tool select */}
        <ScrollArea
          scrollbars="horizontal"
          type="hover"
          style={{ flexGrow: '1' }}
        >
          <Flex
            direction="row"
            justify={{ initial: 'center', xs: 'end' }}
            p="1"
            mb="2"
            gap="2"
            align="center"
          >
            <SegmentedControl.Root
              defaultValue={defaultTool}
              onValueChange={setCurTool}
              size="2"
              radius="medium"
            >
              {tools.map((tool) => {
                return (
                  <SegmentedControl.Item
                    accessKey={tool.key}
                    key={tool.id}
                    value={tool.id}
                    ref={tool.ref}
                  >
                    <Flex
                      direction="row"
                      align="center"
                    >
                      <HoverCard.Root>
                        <HoverCard.Trigger>
                          <tool.icon />
                        </HoverCard.Trigger>
                        <HoverCard.Content
                          size="1"
                          width="240px"
                        >
                          <Flex
                            direction="row"
                            justify="between"
                            gap="2"
                            align="center"
                          >
                            <Heading
                              as="h3"
                              size="4"
                              truncate
                            >
                              {tool.title}
                            </Heading>
                            <Kbd>{tool.key.toUpperCase()}</Kbd>
                          </Flex>
                          <Separator
                            size="4"
                            my="2"
                          />
                          <Text
                            as="p"
                            size="2"
                          >
                            {tool.description}
                          </Text>
                        </HoverCard.Content>
                      </HoverCard.Root>
                    </Flex>
                  </SegmentedControl.Item>
                );
              })}
            </SegmentedControl.Root>
          </Flex>
        </ScrollArea>
      </Flex>
      {/* Editor */}
      <ScrollArea
        type="auto"
        ref={editorWrapperRef}
        scrollbars="both"
        style={{ height: `${editorHeight}px`, outline: '1px dashed var(--gray-a7)', outlineOffset: '1px' }}
      >
        <Box
          position="relative"
          width="min-content"
          id="editor"
          style={{ margin: '10px 16px 12px 10px' }}
        >
          <canvas
            style={{ width: `${visualLayerWidth}px` }}
            width={layerSize.width}
            height={layerSize.height}
            ref={bgImageCanvasRef}
          ></canvas>
          {layers.map((layer, index) => {
            return (
              <canvas
                key={layer.id}
                style={{ position: 'absolute', top: 0, left: 0, width: `${visualLayerWidth}px` }}
                width={layerSize.width}
                height={layerSize.height}
                ref={index === layers.length - 1 && drawingSettings.drawing ? curLayerRef : null}
              ></canvas>
            );
          })}
          <canvas
            style={{ position: 'absolute', top: 0, left: 0, width: `${visualLayerWidth}px`, cursor: 'crosshair' }}
            width={layerSize.width}
            height={layerSize.height}
            ref={interactionHandlerCanvasRef}
          ></canvas>
        </Box>
      </ScrollArea>
      <ToastContainer limit={1} />
    </Flex>
  );
};

export default Instructify;
