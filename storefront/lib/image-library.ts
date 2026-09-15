const photo = (id: string, width = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&fm=webp&w=${width}&q=88`;

export const editorialImages = {
  hero: photo('photo-1564616836577-9bd4ece8c1f5', 2000),
  atelier: photo('photo-1569397288884-4d43d6738fbd', 1400),
  collections: {
    gold: photo('photo-1515562141207-7a88fb7ce338', 1600),
    pearl: photo('photo-1599643478518-a784e5dc4c8f', 1600),
    silver: photo('photo-1605100804763-247f67b3557e', 1600),
    heritage: photo('photo-1602173574767-37ac01994b2a', 1600),
  },
} as const;

const productImagePool = [
  photo('photo-1564616836577-9bd4ece8c1f5'),
  photo('photo-1569397288884-4d43d6738fbd'),
  photo('photo-1515562141207-7a88fb7ce338'),
  photo('photo-1599643478518-a784e5dc4c8f'),
  photo('photo-1535632066927-ab7c9ab60908'),
  photo('photo-1605100804763-247f67b3557e'),
  photo('photo-1602173574767-37ac01994b2a'),
  photo('photo-1599643477877-530eb83abc8e'),
  photo('photo-1611591437281-460bfbe1220a'),
  photo('photo-1630019852942-f89202989a59'),
  photo('photo-1635767798638-3e25273a8236'),
  photo('photo-1603561591411-07134e71a2a9'),
] as const;

export const productImages = (index: number) => {
  const first = index % productImagePool.length;
  return [
    productImagePool[first],
    productImagePool[(first + 3) % productImagePool.length],
    productImagePool[(first + 7) % productImagePool.length],
  ];
};

