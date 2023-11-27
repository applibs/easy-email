import { request } from './axios.config';
import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dwkp0e1yo/image/upload';

const UPLOAD_URL = '/ajaxcall/uploadFileEmail';

const PLACEHOLDERS_URL = '/api/mailing-data/placeholders';

const STYLES_URL = '/api/mailing-data/styles';

export const common = {
  async uploadByQiniu(file: File | Blob): Promise<string> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'easy-email-test');

    const res = await axios.post<{ url: string }>(CLOUDINARY_URL, data);
    return res.data.url;
  },

  uploadByUrl(url: string) {
    return request.get<string>('/upload/user/upload-by-url', {
      params: {
        url,
      },
    });
  },

  async upload(file: File | Blob): Promise<string> {
    const data = new FormData();
    data.append('file', file);
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    axios.defaults.headers.common['X-Ajax'] = '1';
    // @ts-ignore
    axios.defaults.headers.common['X-CSRF-Token'] = document.querySelector("meta[name=csrf-token]").getAttribute("content");

    const res = await axios.post<{ url: string }>(UPLOAD_URL, data);

    return res.data.url;
  },

  async getPlaceholders() {
    const campaign_id = document.querySelector('#data_campaign_id');//%7B%7D
    //
    return (await axios.get<{}>(
      PLACEHOLDERS_URL,
      {
        params: {
          campaign_id: campaign_id?.getAttribute('value'),
        },
      },
    )).data;
  },

  async getStyles() {
    return (await axios.get<{}>(STYLES_URL)).data;
  },

  getMenu(): Promise<IAppMenuItem[]> {
    return Promise.resolve([
      {
        name: 'Šablony',
        icon: 'bar-chart',
        isOpen: true,
        children: [
          {
            name: 'Šablony',
            url: '/',
          },
        ],
      },
    ]);
  },
  sendTestEmail(data: { toEmail: string; subject: string; html: string; text: string }) {
    return request.post('/email/user/send', {
      to_email: data.toEmail,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
  },

};

export interface IAppMenuItem {
  name: string;
  url?: string;
  icon: string;
  isOpen?: boolean;
  children: IAppSubMenuItem[];
}

export interface IAppSubMenuItem {
  name: string;
  url: string;
  isOpen?: boolean;
}

// Encoding UTF8 ⇢ base64
export function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(parseInt(p1, 16));
  }));
}

// Decoding base64 ⇢ UTF8
export function b64DecodeUnicode(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}