import { getNodeIdxClassName, getNodeTypeClassName } from './block';
import { classnames } from './classnames';

export function getPreviewClassName(idx: string | null | undefined, type: string) {
  return classnames('email-block',
    idx && getNodeIdxClassName(idx),
    getNodeTypeClassName(type));
}