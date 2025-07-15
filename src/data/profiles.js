const allProfileData = {
      "2141_Plastimarau_C3_FlexoPower_Maq205_NExT_WSI_BOPP_PET_INT": { "densities": { "cyan": { "min": 1.276, "target": 1.376, "max": 1.476 }, "magenta": { "min": 1.422, "target": 1.522, "max": 1.622 }, "yellow": { "min": 0.928, "target": 1.028, "max": 1.128 }, "black": { "min": 1.426, "target": 1.526, "max": 1.626 } } },
      "2142_Plastimarau_C3_FlexoPower_Maq205_NExT_WSI_PE_INT": { "densities": { "cyan": { "min": 1.242, "target": 1.342, "max": 1.442 }, "magenta": { "min": 1.292, "target": 1.392, "max": 1.492 }, "yellow": { "min": 0.908, "target": 1.008, "max": 1.108 }, "black": { "min": 1.358, "target": 1.458, "max": 1.558 } } },
      "2143_Plastimarau_C3_FlexoPower_Maq205_NExT_WSI_PE_EXT": { "densities": { "cyan": { "min": 0.97, "target": 1.07, "max": 1.17 }, "magenta": { "min": 1.122, "target": 1.222, "max": 1.322 }, "yellow": { "min": 0.642, "target": 0.742, "max": 0.842 }, "black": { "min": 1.064, "target": 1.164, "max": 1.264 } } },
      "2144_Plastimarau_C3_FlexoPower_Maq205_NExT_WSI_PE PIG_EXT": { "densities": { "cyan": { "min": 1.128, "target": 1.228, "max": 1.328 }, "magenta": { "min": 1.392, "target": 1.492, "max": 1.592 }, "yellow": { "min": 0.91, "target": 1.01, "max": 1.11 }, "black": { "min": 1.29, "target": 1.39, "max": 1.49 } } },
      "2149_Plastimarau_C3_FlexoPower_Maq205_KodakNX_BOPP_PET_INT": { "densities": { "cyan": { "min": 1.296, "target": 1.396, "max": 1.496 }, "magenta": { "min": 1.358, "target": 1.458, "max": 1.558 }, "yellow": { "min": 0.946, "target": 1.046, "max": 1.146 }, "black": { "min": 1.33, "target": 1.43, "max": 1.53 } } },
      "2150_Plastimarau_C3_FlexoPower_Maq205_KodakNX_PE_INT": { "densities": { "cyan": { "min": 1.118, "target": 1.218, "max": 1.318 }, "magenta": { "min": 1.228, "target": 1.328, "max": 1.428 }, "yellow": { "min": 0.904, "target": 1.004, "max": 1.104 }, "black": { "min": 1.308, "target": 1.408, "max": 1.508 } } },
      "2151_Plastimarau_C3_FlexoPower_Maq205_KodakNX_PE_EXT": { "densities": { "cyan": { "min": 1.226, "target": 1.326, "max": 1.426 }, "magenta": { "min": 1.258, "target": 1.358, "max": 1.458 }, "yellow": { "min": 0.994, "target": 1.094, "max": 1.194 }, "black": { "min": 1.342, "target": 1.442, "max": 1.542 } } },
      "2152_Plastimarau_C3_FlexoPower_Maq205_KodakNX_PE PIG_EXT": { "densities": { "cyan": { "min": 1.204, "target": 1.304, "max": 1.404 }, "magenta": { "min": 1.286, "target": 1.386, "max": 1.486 }, "yellow": { "min": 0.938, "target": 1.038, "max": 1.138 }, "black": { "min": 1.318, "target": 1.418, "max": 1.518 } } },
      "2180_Plastimarau_C3_FlexoPower_Maq202_LUX_WSI_BOPP_PET_INT": { "densities": { "cyan": { "min": 1.198, "target": 1.298, "max": 1.398 }, "magenta": { "min": 1.312, "target": 1.412, "max": 1.512 }, "yellow": { "min": 0.982, "target": 1.082, "max": 1.182 }, "black": { "min": 1.294, "target": 1.394, "max": 1.494 } } },
      "2181_Plastimarau_C3_FlexoPower_Maq202_LUX_WSI_PE_INT": { "densities": { "cyan": { "min": 1.188, "target": 1.288, "max": 1.388 }, "magenta": { "min": 1.298, "target": 1.398, "max": 1.498 }, "yellow": { "min": 0.972, "target": 1.072, "max": 1.172 }, "black": { "min": 1.284, "target": 1.384, "max": 1.484 } } },
      "2182_Plastimarau_C3_FlexoPower_Maq202_LUX_WSI_PE_EXT": { "densities": { "cyan": { "min": 1.176, "target": 1.276, "max": 1.376 }, "magenta": { "min": 1.274, "target": 1.374, "max": 1.474 }, "yellow": { "min": 0.962, "target": 1.062, "max": 1.162 }, "black": { "min": 1.274, "target": 1.374, "max": 1.474 } } },
      "2183_Plastimarau_C3_FlexoPower_Maq202_LUX_WSI_PE PIG_EXT": { "densities": { "cyan": { "min": 1.302, "target": 1.402, "max": 1.502 }, "magenta": { "min": 1.316, "target": 1.416, "max": 1.516 }, "yellow": { "min": 0.968, "target": 1.068, "max": 1.168 }, "black": { "min": 1.049, "target": 1.149, "max": 1.249 } } },
      "2958_Plastimarau_GE_FlexoPower_Adv01_PET_INT_Tinta_299": { "densities": { "cyan": { "min": 1.56, "target": 1.66, "max": 1.76 }, "magenta": { "min": 2.04, "target": 2.14, "max": 2.24 }, "yellow": { "min": 1.11, "target": 1.21, "max": 1.31 }, "black": { "min": 1.81, "target": 1.91, "max": 2.01 } } },
      "2959_Plastimarau_GE_FlexoPower_Adv01_PE_INT_Tinta_299": { "densities": { "cyan": { "min": 1.78, "target": 1.88, "max": 1.98 }, "magenta": { "min": 2.02, "target": 2.12, "max": 2.22 }, "yellow": { "min": 1.07, "target": 1.17, "max": 1.27 }, "black": { "min": 1.75, "target": 1.85, "max": 1.95 } } },
      "2960_Plastimarau_GE_FlexoPower_Adv01_PE_PIG_EXT_Tinta_299": { "densities": { "cyan": { "min": 1.8, "target": 1.9, "max": 2.0 }, "magenta": { "min": 1.7, "target": 1.8, "max": 1.9 }, "yellow": { "min": 1.03, "target": 1.13, "max": 1.23 }, "black": { "min": 1.53, "target": 1.63, "max": 1.73 } } },
      "2961_Plastimarau_GE_FlexoPower_Adv01_PET_INT_Tinta_499": { "densities": { "cyan": { "min": 1.42, "target": 1.52, "max": 1.62 }, "magenta": { "min": 1.65, "target": 1.75, "max": 1.85 }, "yellow": { "min": 1.01, "target": 1.11, "max": 1.21 }, "black": { "min": 2.07, "target": 2.17, "max": 2.27 } } },
      "2261_NX_Adv01_PE_EXT": { "densities": { "cyan": { "min": 1.28, "target": 1.38, "max": 1.48 }, "magenta": { "min": 1.13, "target": 1.23, "max": 1.33 }, "yellow": { "min": 0.80, "target": 0.90, "max": 1.00 }, "black": { "min": 1.40, "target": 1.50, "max": 1.60 } } },
      "2264_NX_Adv01_PE_PET_INT": { "densities": { "cyan": { "min": 1.50, "target": 1.60, "max": 1.70 }, "magenta": { "min": 1.35, "target": 1.45, "max": 1.55 }, "yellow": { "min": 1.00, "target": 1.10, "max": 1.20 }, "black": { "min": 1.57, "target": 1.67, "max": 1.77 } } },
      "2267_NX_Adv01_PE_PIG_EXT": { "densities": { "cyan": { "min": 1.33, "target": 1.43, "max": 1.53 }, "magenta": { "min": 1.33, "target": 1.43, "max": 1.53 }, "yellow": { "min": 0.98, "target": 1.08, "max": 1.18 }, "black": { "min": 1.39, "target": 1.49, "max": 1.59 } } },
      "2269_Next_FTD_WSI_PE_EXT": { "densities": { "cyan": { "min": 1.15, "target": 1.25, "max": 1.35 }, "magenta": { "min": 1.10, "target": 1.20, "max": 1.30 }, "yellow": { "min": 0.75, "target": 0.85, "max": 0.95 }, "black": { "min": 1.25, "target": 1.35, "max": 1.45 } } },
      "2270_Next_FTD_WSI_PE_PET_INT": { "densities": { "cyan": { "min": 1.20, "target": 1.30, "max": 1.40 }, "magenta": { "min": 1.30, "target": 1.40, "max": 1.50 }, "yellow": { "min": 0.92, "target": 1.02, "max": 1.12 }, "black": { "min": 1.47, "target": 1.57, "max": 1.67 } } },
      "2272_Next_FTD_WSI_PE_PIG_EXT": { "densities": { "cyan": { "min": 1.10, "target": 1.20, "max": 1.30 }, "magenta": { "min": 1.20, "target": 1.30, "max": 1.40 }, "yellow": { "min": 0.87, "target": 0.97, "max": 1.07 }, "black": { "min": 1.37, "target": 1.47, "max": 1.57 } } },
      "2340_Next_FTD_IE_WSI_PE_PIG_EXT": { "densities": { "cyan": { "min": 1.10, "target": 1.20, "max": 1.30 }, "magenta": { "min": 1.20, "target": 1.30, "max": 1.40 }, "yellow": { "min": 0.87, "target": 0.97, "max": 1.07 }, "black": { "min": 1.37, "target": 1.47, "max": 1.57 } } },
      "0001_EPR_FTD_WSI_PE_PET_INT": { "densities": { "cyan": { "min": 1.43, "target": 1.53, "max": 1.63 }, "magenta": { "min": 1.44, "target": 1.54, "max": 1.64 }, "yellow": { "min": 1.04, "target": 1.14, "max": 1.24 }, "black": { "min": 1.45, "target": 1.55, "max": 1.65 } } },
      "0002_EPR_FTD_WSI_PE_EXT": { "densities": { "cyan": { "min": 1.25, "target": 1.35, "max": 1.45 }, "magenta": { "min": 1.27, "target": 1.37, "max": 1.47 }, "yellow": { "min": 0.89, "target": 0.99, "max": 1.09 }, "black": { "min": 1.49, "target": 1.59, "max": 1.69 } } },
      "0003_EPR_FTD_WSI_PE_PIG_EXT": { "densities": { "cyan": { "min": 1.37, "target": 1.47, "max": 1.57 }, "magenta": { "min": 1.38, "target": 1.48, "max": 1.58 }, "yellow": { "min": 0.98, "target": 1.08, "max": 1.18 }, "black": { "min": 1.39, "target": 1.49, "max": 1.59 } } },
      "5373_Plastimarau_GE_Maq206_NEF_XPS_PE_PIG_EXT_TSA_60Lpc_DotLess": {
    "densities": {
      "cyan":    { "min": 1.41, "target": 1.51, "max": 1.61 },
      "magenta": { "min": 1.48, "target": 1.58, "max": 1.68 },
      "yellow":  { "min": 0.91, "target": 1.01, "max": 1.11 },
      "black":   { "min": 1.28, "target": 1.38, "max": 1.48 }
    }
  }

  "0004_Plastimarau_Flexotech_PE_PIG_ESXR_64lpc_TSA": {
    "densities": {
      "cyan":    { "min": 1.35, "target": 1.45, "max": 1.55 },
      "magenta": { "min": 1.35, "target": 1.45, "max": 1.55 },
      "yellow":  { "min": 0.90, "target": 1.00, "max": 1.10 },
      "black":   { "min": 1.60, "target": 1.70, "max": 1.80 }
    }
  }
};
