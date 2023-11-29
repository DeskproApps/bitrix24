import { z } from "zod";

export const getMetadataBasedSchema = (
  fields: {
    name: string;
  }[],
  customInputs: {
    [key: string]: z.ZodTypeAny;
  }
) => {
  const newObj: {
    [key: string]: z.ZodTypeAny;
  } = {};

  for (const field of fields) {
    newObj[field.name] = z.string().optional();
  }

  const schema = z
    .object({
      ...newObj,
      ...customInputs,
    })
    .passthrough()
    .transform((obj) => {
      for (const key of Object.keys(obj)) {
        if (obj[key as keyof typeof obj] === "") {
          delete obj[key as keyof typeof obj];
        }
      }
      return obj;
    });

  return schema;
};

export const getContactSchema = () => {
  const schema = z.object({
    NAME: z.string(),
    EMAIL: z
      .array(
        z.object({
          VALUE: z.string().email().optional(),
        })
      )
      .optional(),
    PHONE: z
      .array(
        z.object({
          VALUE: z.string().optional(),
        })
      )
      .optional(),
    ADDRESS: z.string().optional(),
    ADDRESS_POSTAL_CODE: z.string().optional(),
    ADDRESS_COUNTRY: z.string().optional(),
    ADDRESS_CITY: z.string().optional(),
    ADDRESS_PROVINCE: z.string().optional(),
  });

  return schema;
};

export const getDealSchema = () => {
  const schema = z
    .object({
      TITLE: z.string(),
      CLOSEDATE: z.string(),
      CONTACT_ID: z.string(),
      PRODUCTS: z
        .array(
          z.object({
            PRODUCT_ID: z.string().or(z.number()),
            QUANTITY: z.number(),
            PRICE: z.number(),
          })
        )
        .optional(),
    })
    .transform((obj) => ({
      ...obj,
      OPPORTUNITY: obj.PRODUCTS?.reduce(
        (acc, product) => acc + product.QUANTITY * product.PRICE,
        0
      ),
      TAX_VALUE: 0,
      TYPE_ID: "SALE",
      PRODUCTS: obj.PRODUCTS?.map((product) => ({
        PRODUCT_ID: product.PRODUCT_ID,
        QUANTITY: product.QUANTITY,
        PRICE: product.PRICE,
      })),
    }));

  return schema;
};

export const getActivitySchema = () => {
  const schema = z.object({
    responsibleId: z.string().optional(),
    ownerId: z.string(),
    ownerTypeId: z.string(),
    description: z.string(),
    deadline: z.string(),
  });

  return schema;
};
