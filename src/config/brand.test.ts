import{describe,expect,it}from'vitest';import{brandConfig}from'./brand';
describe('brand configuration',()=>{it('provides the public product and world names from one typed source',()=>{expect(brandConfig).toEqual({productName:'Chef Cinnamon’s Reading Adventure',shortName:'Chef Cinnamon',worldName:'The Storybook Kingdom'})})});
