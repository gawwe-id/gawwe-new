import { z } from "zod";
import { j, publicProcedure } from "../jstack";
import axios from "axios";

const BaseRegionSchema = z.object({
  code: z.string(),
  name: z.string(),
});

// Specific schema for villages that includes postal code
const VillageSchema = BaseRegionSchema.extend({
  postalCode: z.string(),
});

// Response schemas for different endpoints
const BaseApiResponseSchema = z.object({
  data: z.array(BaseRegionSchema),
});

const VillageApiResponseSchema = z.object({
  data: z.array(VillageSchema),
});

const RegencyInputSchema = z.object({
  provinceId: z.string().min(1, "Province ID is required"),
});

const DistrictInputSchema = z.object({
  regencyId: z.string().min(1, "Regency ID is required"),
});

const VillageInputSchema = z.object({
  districtId: z.string().min(1, "District ID is required"),
});

export const regionsRouter = j.router({
  provinces: publicProcedure.query(async ({ c }) => {
    try {
      const response = await axios.get<z.infer<typeof BaseApiResponseSchema>>(
        "https://wilayah.id/api/provinces.json"
      );

      return c.superjson(
        {
          data: response.data.data,
          message: "Successfully retrieved provinces",
        },
        200
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch provinces: ${error.message}`);
      }
      throw new Error("An unexpected error occurred while fetching provinces");
    }
  }),

  regencies: publicProcedure
    .input(RegencyInputSchema)
    .query(async ({ c, input }) => {
      try {
        const { provinceId } = input;
        const response = await axios.get<z.infer<typeof BaseApiResponseSchema>>(
          `https://wilayah.id/api/regencies/${provinceId}.json`
        );

        return c.superjson(
          {
            data: response.data.data,
            message: "Successfully retrieved regencies",
          },
          200
        );
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch regencies: ${error.message}`);
        }
        throw new Error(
          "An unexpected error occurred while fetching regencies"
        );
      }
    }),

  districts: publicProcedure
    .input(DistrictInputSchema)
    .query(async ({ c, input }) => {
      try {
        const { regencyId } = input;
        const response = await axios.get<z.infer<typeof BaseApiResponseSchema>>(
          `https://wilayah.id/api/districts/${regencyId}.json`
        );

        return c.superjson(
          {
            data: response.data.data,
            message: "Successfully retrieved districts",
          },
          200
        );
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch districts: ${error.message}`);
        }
        throw new Error(
          "An unexpected error occurred while fetching districts"
        );
      }
    }),

  villages: publicProcedure
    .input(VillageInputSchema)
    .query(async ({ c, input }) => {
      try {
        const { districtId } = input;
        const response = await axios.get<
          z.infer<typeof VillageApiResponseSchema>
        >(`https://wilayah.id/api/villages/${districtId}.json`);

        return c.superjson({
          data: response.data.data,
          status: "success",
          message: "Successfully retrieved villages",
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch villages: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while fetching villages");
      }
    }),
});
