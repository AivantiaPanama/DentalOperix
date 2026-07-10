# DentalOperix 72.1.3-I2 - Rule Registry Infrastructure Package Manifest

## Package

- Name: DENTALOPERIX_72_1_3_I2_RULE_REGISTRY_INFRASTRUCTURE_PACKAGE
- Program: 72.1 - Governance Platform Implementation
- Increment: 72.1.3 - Baseline Compliance Validator
- Package: 72.1.3-I2 - Rule Registry Infrastructure
- Status: IMPLEMENTED - PENDING USER VALIDATION
- Baseline: DENTALOPERIX_BASELINE_71_5_RELEASE_CANDIDATE

## Contents

This package adds only the following new paths:

- `src/governance/rule-registry/`
- `governance/13-implementation/PROGRAM_72_1_3_I2_RULE_REGISTRY_INFRASTRUCTURE_IMPLEMENTATION_REPORT.md`
- `governance/14-evidence/PROGRAM_72_1_3_I2_VALIDATION_EVIDENCE_TEMPLATE.md`

## Governance Notes

No protected components are modified. No persistence, API, UI, runtime, or source-of-truth changes are introduced.

## Checksums

```text
d00aae0eba4e1eb73124610d948fc6be441fa13de35d0f41edb229a4f7544ee9  ./governance/13-implementation/PROGRAM_72_1_3_I2_RULE_REGISTRY_INFRASTRUCTURE_IMPLEMENTATION_REPORT.md
e2c8c37e4e53e33c1e873b04394799b944ecd4e7f11cecdc691aab63adc94ef6  ./governance/14-evidence/PROGRAM_72_1_3_I2_VALIDATION_EVIDENCE_TEMPLATE.md
062bd001e193cf917730e855641eefb9e037d074e59e41e1dd54f9a42ba0047d  ./src/governance/rule-registry/application/find-rule-by-id-use-case.ts
58e7bb92ea13323abfac1ed0eaa08f133ef3a4cce8910d3dff4d50fc3ec91e85  ./src/governance/rule-registry/application/index.ts
454c056a2dc8cb18736e8b8047d08dc34135e6b0bdfb5405a513f7f12c913e16  ./src/governance/rule-registry/application/list-rules-use-case.ts
4d08c6f22fca5558d1e87275fe5f629702ba7747099ffd3e2b573ceec45617d8  ./src/governance/rule-registry/application/register-rule-use-case.ts
9f8e0961d15059d769b4957b81c588f786a921aa1309e8bbdcfcea7e2f6f4282  ./src/governance/rule-registry/catalog/certified-rule-catalog.ts
927baad959eb1ec11e5c39eebb08997837dbbc0b332cd815ac57028903c5655b  ./src/governance/rule-registry/catalog/index.ts
60b7d240e94cdecf15e241ace88a50e223b8f5e76358d29d7681a6fe22d77542  ./src/governance/rule-registry/docs/72_1_3_I2_RULE_REGISTRY_INFRASTRUCTURE_IMPLEMENTATION_NOTES.md
2a9dc66472a062365ed2a0e6e9bb641d40de59de3901bc039f81bc0383dcbb97  ./src/governance/rule-registry/domain/index.ts
76f6db9537141e40190d18173f9419e0e017889ecbeeb9e522f5489880e9c1b6  ./src/governance/rule-registry/domain/rule-category.ts
3bd0098c9551b9385c1edafcd92e0b4019a7da8de7877a63e5c35c6be0fc6bfd  ./src/governance/rule-registry/domain/rule-definition.ts
5921a4bfd861c868df1f10d24eb9db79d4dcbaed8688bcf5c841ddc40717e161  ./src/governance/rule-registry/domain/rule-version.ts
00e3cff37918700ce5c01a31be66635cc5abb4433c8b6051c76d6aeac51ddcea  ./src/governance/rule-registry/index.ts
34600b937c6c91f4e2abe241eb6b5f2160402033d5dfca17cc986bc63304212c  ./src/governance/rule-registry/infrastructure/in-memory-rule-registry.ts
b5f1fe9c50571ea4c13d8a5ba11040fcd25d6ead5730b8eee25bc08f55c5c85a  ./src/governance/rule-registry/infrastructure/index.ts
538870c895e5a097c71e50337c7d8992946ad52cb254211adf866653f7f86155  ./src/governance/rule-registry/ports/index.ts
5cbee53bea0c2f79584948a70bf30d5affb5c3cde061117ed25a0f8c41f3cff7  ./src/governance/rule-registry/ports/rule-registry-port.ts
```
