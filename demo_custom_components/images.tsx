import IMAGE_09 from '../../images/image_09.png';
import IMAGE_10 from '../../images/image_10.png';
import IMAGE_15 from '../../images/image_15.png';
import IMAGE_16 from '../../images/image_16.png';
import IMAGE_17 from '../../images/image_17.png';
import IMAGE_31 from '../../images/image_31.png';
import IMAGE_59 from '../../images/image_59.png';
import IMAGE_02 from '../../images/image_02.png';
import IMAGE_03 from '../../images/image_03.png';
import IMAGE_04 from '../../images/image_04.png';
import AttributePanel_02 from '../../images/AttributePanel_02.png';

import SMILLE_01 from '../../images/smile_1.svg';
import SMILLE_02 from '../../images/smile_2.svg';
import SMILLE_03 from '../../images/smile_3.svg';
import SMILLE_04 from '../../images/smile_4.svg';
import SMILLE_05 from '../../images/smile_5.svg';

import { ImageManager } from 'easy-email-core';
export const customImagesMap = {
  IMAGE_02,
  IMAGE_03,
  IMAGE_04,
  IMAGE_09,
  IMAGE_10,
  IMAGE_15,
  IMAGE_16,
  IMAGE_17,
  IMAGE_31,
  IMAGE_59,
  AttributePanel_02,
  SMILLE_01,
  SMILLE_02,
  SMILLE_03,
  SMILLE_04,
  SMILLE_05,
};

export type Image = keyof typeof customImagesMap

export function getImg(name: keyof typeof customImagesMap) {
  return ImageManager.get(name);
}