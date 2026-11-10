"""Exporta certificados confiáveis do Windows, sem chaves privadas, para o npm local."""
from pathlib import Path
import ssl

certificate_file = Path(__file__).resolve().parents[1] / '.local' / 'certificados-npm.pem'
certificates: set[bytes] = set()
for certificate_store in ('ROOT', 'CA'):
    for certificate_bytes, encoding, trust in ssl.enum_certificates(certificate_store):
        if encoding == 'x509_asn' and (trust is True or '1.3.6.1.5.5.7.3.1' in trust):
            certificates.add(certificate_bytes)
if not certificates:
    raise RuntimeError('Nenhum certificado confiável para autenticação TLS foi encontrado no Windows')
certificate_file.parent.mkdir(parents=True, exist_ok=True)
certificate_file.write_text(''.join(ssl.DER_cert_to_PEM_cert(cert) for cert in sorted(certificates)), encoding='ascii')
print(f'Certificados Windows exportados: {len(certificates)}; arquivo: {certificate_file}')
