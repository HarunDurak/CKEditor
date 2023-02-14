import {Component, OnInit, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {MyUploadAdapter} from '../my-upload-adapter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HomeComponent),
      multi: true
    }
  ]
})
export class HomeComponent implements OnInit, ControlValueAccessor {

  public Editor = ClassicEditor;

  @Input() readonly: boolean = false;

  private _value: string = '';
  private editorInstance: any;

  get value() {
    return this._value;
  }

  set value(v: string) {
    if (v !== this._value) {
      console.log(this._value,'ok');
      this._value = v;
      this.onChange(v);
    }
  }

  constructor() {
  }


  onChange(v: any) {

  }

  onTouch() {
  }

  writeValue(obj: any): void {
    this._value = obj;

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }


  ngOnInit(): void {
  }

  title = 'ckeditorAngular10';
  @Input() config: any = {
    plugins: [MyUploadAdapter],

    toolbar: {
      items: [
        'heading', '|',
        'fontfamily', 'fontsize',
        'alignment',
        'fontColor', 'fontBackgroundColor', '|',
        'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
        'link', '|',
        'outdent', 'indent', '|',
        'bulletedList', '-', 'numberedList', 'todoList', '|',
        'code', 'codeBlock', '|',
        'insertTable', '|',
        'imageUpload', 'blockQuote', '|',
        'todoList'
        ,
        'undo', 'redo',
      ],
      shouldNotGroupWhenFull: true,

    },
    image: {
      // Configure the available styles.
      styles: [
        'alignLeft', 'alignCenter', 'alignRight'
      ],

      // Configure the available image resize options.
      resizeOptions: [
        {
          name: 'resizeImage:original',
          label: 'Original',
          value: null
        },
        {
          name: 'resizeImage:50',
          label: '25%',
          value: '25'
        },
        {
          name: 'resizeImage:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'resizeImage:75',
          label: '75%',
          value: '75'
        }
      ],

      // You need to configure the image toolbar, too, so it shows the new style
      // buttons as well as the resize buttons.
      toolbar: [
        'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
        '|',
        'ImageResize',
        '|',
        'imageTextAlternative'
      ]
    },
    // simpleUpload: {
    //    The URL that the images are uploaded to.
    // uploadUrl: 'http://localhost:52536/api/Image/ImageUpload',

    //   Enable the XMLHttpRequest.withCredentials property.

    //},

    language: 'en'
  };


  onReady(editor: any): void {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new MyUploadAdapter(loader);
    };

    this.editorInstance = editor;
  }

  drag(ev: any): void {
    ev.dataTransfer.setData('dragElement', ev.target.id);
  }

  fieldMap: Map<string, string> = new Map<string, string>([
    ['studentFirstName', '{{student.firstName}}'],
    ['studentLastName', '{{student.lastName}}'],
    ['courseName', '{{course.name}}'],
    ['courseHours', '{{course.hours}}'],
  ]);

  drop(ev: any): void {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('dragElement');
    const dataValue = this.fieldMap.get(data);
    const viewFragment = this.editorInstance.data.processor.toView(dataValue);
    const modelFragment = this.editorInstance.data.toModel(viewFragment);
    this.editorInstance.model.insertContent(modelFragment);
  }
}
