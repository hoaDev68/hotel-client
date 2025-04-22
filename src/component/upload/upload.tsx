import { Upload, Button, Image, App, message as staticMessage } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';
import { useState } from 'react';

export default function ImageUploader({
  initialImage,
  onChange,
}: {
  initialImage: string;
  onChange: (imageUrl: string) => void;
}) {
  const [preview, setPreview] = useState<string>(initialImage);
  const [uploading, setUploading] = useState(false);

  const { message } = App.useApp(); // ✅ Lấy context message

  const handleUpload = async (file: RcFile) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await fetch('http://localhost:8080/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();

      const fullUrl = `http://localhost:8080${data.path}`;
      setPreview(fullUrl);
      onChange(fullUrl);
      message.success('Tải ảnh lên thành công'); // ✅ Gọi từ context
    } catch (err) {
      message.error('Tải ảnh thất bại');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    handleUpload(file);
    return false;
  };

  return (
    <div>
      <Image
        src={preview || undefined} // ⚠ Tránh truyền "" (empty string)
        alt="Room"
        width={300}
        height={200}
        className="rounded mb-2"
        style={{ objectFit: 'cover' }}
      />
      <Upload
        showUploadList={false}
        beforeUpload={beforeUpload}
      >
        <Button icon={<UploadOutlined />} loading={uploading}>
          {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
        </Button>
      </Upload>
    </div>
  );
}
