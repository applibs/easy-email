import { IBlockData, JsonToMjml } from 'easy-email-core';
import services from '@demo/services';
import imgEmail from '../images/emailImage.png';

export async function emailToImage(content: IBlockData) {
  const mjml = (await import('mjml-browser')).default;
  const html2canvas = (await import('html2canvas')).default;
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.innerHTML = mjml(
    JsonToMjml({
      data: content,
      mode: 'production',
      context: content,
    }),
    {
      beautify: true,
      validationLevel: 'soft',
    },
  ).html;
  document.body.appendChild(container);

  const blob = await new Promise<any>(resolve => {
    html2canvas(container, { useCORS: true }).then(canvas =>
      canvas.toBlob(resolve, 'png', 0.1),
    );
  });

  document.body.removeChild(container);

  try {
    return await services.common.uploadByQiniu(blob);
  } catch (error) {
    return process.env.NODE_ENV === "production" ? '/Modules/Mailing/Assets/Mailing/easy-email/images/emailImage.png' : imgEmail;
  }
}
