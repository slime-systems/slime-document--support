import { default as axios } from 'axios';
import { SignJWT } from 'jose';

// Replace these with your credentials.
const projectId = 123456;
const keyId = 'k1234';
const secret = 'Bl9j0NXcWz70VMqxzk3Psk1ZAwQ6Pa5xlT9EHucd';

const apiEndpoint = `https://app.thai-document.slime.systems/projects/${projectId}/api`;
const byteEncoder = new TextEncoder();
const encodedSecret = byteEncoder.encode(secret);

const jwt = await new SignJWT({
  sub: 'test/hello',
  data: {
    name: 'Sekai',
  },
}).setIssuedAt().setAudience('thai-document.slime.systems').setProtectedHeader({
  typ: 'JWT',
  alg: 'HS256',
  kid: keyId,
}).sign(encodedSecret);

try {
  const response = await axios.post(apiEndpoint, {
    request: jwt,
  });
  console.log(response?.data);
} catch (e) {
  console.error(e?.response?.data || 'Network Error!');
}
