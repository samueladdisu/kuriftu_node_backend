const { getPromoCode } = require('../controllers/user/promo.controller');

exports.calculatePreEntoto = (kid, teen, double, promo) => {
  let price = 0.00;
  if (promo == "") {
    if (teen == 0 && kid == 0) {
      price = double;
    } else if (teen == 1 && kid == 0) {
      price = double + 38;
    } else if (teen == 0 && kid == 1) {
      price = double + 10;
    }
  } else if (promo !== "" && promo !== "member") {
    if (teen == 0 && kid == 0) {
      price = double;
    } else if (teen == 1 && kid == 0) {
      price = double + 38;
    } else if (teen == 0 && kid == 1) {
      price = double + 10;
    }
    let discountPrice = getPromoCode(price, promo);
    if (discountPrice == price) {
      return price;
    } else if (discountPrice > price) {
      return price;
    } else {
      price = discountPrice;
      return price;
    }
  }
  return price;
}

exports.calculatePre = (kid, teen, double, dMember, promo) => {
  let price = 0.00;

  if (promo === "member") {
    if (teen === 0 && kid === 0) {
      price = dMember;
    } else if (teen === 1 && kid === 0) {
      price = dMember + 38;
    } else if (teen === 0 && kid === 1) {
      price = dMember + 10;
    }
  } else if (promo === "") {
    if (teen === 0 && kid === 0) {
      price = double;
    } else if (teen === 1 && kid === 0) {
      price = double + 38;
    } else if (teen === 0 && kid === 1) {
      price = double + 10;
    }
  } else if (promo !== "" && promo !== "member") {
    if (teen === 0 && kid === 0) {
      price = double;
    } else if (teen === 1 && kid === 0) {
      price = double + 38;
    } else if (teen === 0 && kid === 1) {
      price = double + 10;
    }

    const discountPrice = getPromoCode(price, promo);
    if (discountPrice === price) {
      return price;
    } else if (discountPrice > price) {
      return price;
    } else {
      price = discountPrice;
      return price;
    }
  }

  return price;
}

exports.calculateEntoto = (ad, kid, teen, double, single, promo) => {
  let price = 0.00;
  if (promo === "") {
    if (ad === 1) {
      if (kid === 0 && teen === 0) {
        price = single;
      } else if (kid === 1 && teen === 1) {
        price = double + 10;
      } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
        price = double;
      } else if (kid === 2 && teen === 0) {
        price = double + 10;
      } else if (kid === 0 && teen === 2) {
        price = double + 38;
      }
    } else if (ad === 2) {
      if (kid === 0 && teen === 0) {
        price = double;
      } else if (kid === 1 && teen === 0) {
        price = double + 10;
      } else if (kid === 1 && teen === 1) {
        price = double + 48;
      } else if (kid === 2 && teen === 0) {
        price = double + 20;
      } else if (kid === 0 && teen === 1) {
        price = double + 38;
      }
    }
  } else if (promo !== "" && promo !== "member") {
    if (ad === 1) {
      if (kid === 0 && teen === 0) {
        price = single;
      } else if (kid === 1 && teen === 1) {
        price = double + 10;
      } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
        price = double;
      } else if (kid === 2 && teen === 0) {
        price = double + 10;
      } else if (kid === 0 && teen === 2) {
        price = double + 38;
      }
    } else if (ad === 2) {
      if (kid === 0 && teen === 0) {
        price = double;
      } else if (kid === 1 && teen === 0) {
        price = double + 10;
      } else if (kid === 1 && teen === 1) {
        price = double + 48;
      } else if (kid === 2 && teen === 0) {
        price = double + 20;
      } else if (kid === 0 && teen === 1) {
        price = double + 38;
      }
    }
    let DiscountPrice = getPromoCode(price, promo);
    if (DiscountPrice === price) {
      return price;
    } else if (DiscountPrice > price) {
      return price;
    } else {
      price = DiscountPrice;
      return price;
    }
  }
  return price;
}


exports.calculatePriceAwash = (ad, kid, teen, Bored, days, selectedDB) => {
  let price = 0.00;
  days.forEach(day => {
    switch (day) {
      case 'Friday':
        if (Bored === "fullBoard") {
          if (ad === 1) {
            if (kid === 0 && teen === 0) {
              price += selectedDB['s_fb_we'];
            } else if (kid === 1 && teen === 1) {
              price += selectedDB['d_fb_we'] + 10;
            } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
              price += selectedDB['d_fb_we'];
            } else if (kid === 2 && teen === 0) {
              price += selectedDB['d_fb_we'] + 10;
            } else if (kid === 0 && teen === 2) {
              price += selectedDB['d_fb_we'] + 38;
            }
          } else if (ad === 2) {
            if (kid === 0 && teen === 0) {
              price += selectedDB['d_fb_we'];
            } else if (kid === 1 && teen === 0) {
              price += selectedDB['d_fb_we'] + 10;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB['d_fb_we'] + 48;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB['d_fb_we'] + 20;
            } else if (kid === 0 && teen === 1) {
              price += selectedDB['d_fb_we'] + 38;
            }
          }
        } else if (Bored === "Half Board") {
          if (ad === 1) {
            if (kid === 0 && teen === 0) {
              price += selectedDB['s_hb_we'];
            } else if (kid === 1 && teen === 1) {
              price += selectedDB['d_hb_we'] + 10;
            } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
              price += selectedDB['d_hb_we'];
            } else if (kid === 2 && teen === 0) {
              price += selectedDB['d_hb_we'] + 10;
            } else if (kid === 0 && teen === 2) {
              price += selectedDB['d_hb_we'] + 38;
            }
          } else if (ad === 2) {
            if (kid === 0 && teen === 0) {
              price += selectedDB['d_hb_we'];
            } else if (kid === 1 && teen === 0) {
              price += selectedDB['d_hb_we'] + 10;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB['d_hb_we'] + 48;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB['d_hb_we'] + 20;
            } else if (kid === 0 && teen === 1) {
              price += selectedDB['d_hb_we'] + 38;
            }
          }
        } else if (Bored === "BedBreakfast") {
          if (ad === 1) {
            if (kid === 0 && teen === 0) {
              // Single occupancy
              price += selectedDB['s_bb_we'];
            } else if (kid === 1 && teen === 1) {
              price += selectedDB['d_bb_we'] + 10;
            } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
              price += selectedDB['d_bb_we'];
            } else if (kid === 2 && teen === 0) {
              price += selectedDB['d_bb_we'] + 10;
            } else if (kid === 0 && teen === 2) {
              price += selectedDB['d_bb_we'] + 38;
            }
          } else if (ad === 2) {
            if (kid === 0 && teen === 0) {
              price += selectedDB['d_bb_we'];
            } else if (kid === 1 && teen === 0) {
              price += selectedDB['d_bb_we'] + 10;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB['d_bb_we'] + 48;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB['d_bb_we'] + 20;
            } else if (kid === 0 && teen === 1) {
              price += selectedDB['d_bb_we'] + 38;
            }
          }
        }
        break;
      case 'Saturday':
        if (Bored === "fullBoard") {
          if (ad === 1) {
            if (kid === 0 && teen === 0) {
              // Single occupancy
              price += selectedDB.s_fb_we;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_fb_we + 10;
            } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
              price += selectedDB.d_fb_we;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_fb_we + 10;
            } else if (kid === 0 && teen === 2) {
              price += selectedDB.d_fb_we + 38;
            }
          } else if (ad === 2) {
            if (kid === 0 && teen === 0) {
              price += selectedDB.d_fb_we;
            } else if (kid === 1 && teen === 0) {
              price += selectedDB.d_fb_we + 10;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_fb_we + 48;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_fb_we + 20;
            } else if (kid === 0 && teen === 1) {
              price += selectedDB.d_fb_we + 38;
            }
          }
        } else if (Bored === "Half Board") {
          if (ad === 1) {
            if (kid === 0 && teen === 0) {
              // Single occupancy
              price += selectedDB.s_hb_we;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_hb_we + 10;
            } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
              price += selectedDB.d_hb_we;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_hb_we + 10;
            } else if (kid === 0 && teen === 2) {
              price += selectedDB.d_hb_we + 38;
            }
          } else if (ad === 2) {
            if (kid === 0 && teen === 0) {
              price += selectedDB.d_hb_we;
            } else if (kid === 1 && teen === 0) {
              price += selectedDB.d_hb_we + 10;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_hb_we + 48;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_hb_we + 20;
            } else if (kid === 0 && teen === 1) {
              price += selectedDB.d_hb_we + 38;
            }
          }
        } else if (Bored === "BedBreakfast") {
          if (ad === 1) {
            if (kid === 0 && teen === 0) {
              // Single occupancy
              price += selectedDB.s_bb_we;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_bb_we + 10;
            } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
              price += selectedDB.d_bb_we;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_bb_we + 10;
            } else if (kid === 0 && teen === 2) {
              price += selectedDB.d_bb_we + 38;
            }
          } else if (ad === 2) {
            if (kid === 0 && teen === 0) {
              price += selectedDB.d_bb_we;
            } else if (kid === 1 && teen === 0) {
              price += selectedDB.d_bb_we + 10;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_bb_we + 48;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_bb_we + 20;
            } else if (kid === 0 && teen === 1) {
              price += selectedDB.d_bb_we + 38;
            }
          }
        }
        break;
      default:
        if (Bored === "fullBoard") {
          if (ad === 1) {
            if (kid === 0 && teen === 0) {
              // Single occupancy
              price += selectedDB.s_bb_wd;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_fb_wd + 10;
            } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
              price += selectedDB.d_fb_wd;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_fb_wd + 10;
            } else if (kid === 0 && teen === 2) {
              price += selectedDB.d_fb_wd + 38;
            }
          } else if (ad === 2) {
            if (kid === 0 && teen === 0) {
              price += selectedDB.d_fb_wd;
            } else if (kid === 1 && teen === 0) {
              price += selectedDB.d_fb_wd + 10;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_fb_wd + 48;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_fb_wd + 20;
            } else if (kid === 0 && teen === 1) {
              price += selectedDB.d_fb_wd + 38;
            }
          }
        } else if (Bored === "Half Board") {
          if (ad === 1) {
            if (kid === 0 && teen === 0) {
              // Single occupancy
              price += selectedDB.s_hb_wd;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_hb_wd + 10;
            } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
              price += selectedDB.d_hb_wd;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_hb_wd + 10;
            } else if (kid === 0 && teen === 2) {
              price += selectedDB.d_hb_wd + 38;
            }
          } else if (ad === 2) {
            if (kid === 0 && teen === 0) {
              price += selectedDB.d_hb_wd;
            } else if (kid === 1 && teen === 0) {
              price += selectedDB.d_hb_wd + 10;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_hb_wd + 48;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_hb_wd + 20;
            } else if (kid === 0 && teen === 1) {
              price += selectedDB.d_hb_wd + 38;
            }
          }
        } else if (Bored === "BedBreakfast") {
          if (ad === 1) {
            if (kid === 0 && teen === 0) {
              // Single occupancy
              price += selectedDB.s_bb_wd;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_bb_wd + 10;
            } else if ((kid === 1 && teen === 0) || (kid === 0 && teen === 1)) {
              price += selectedDB.d_bb_wd;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_bb_wd + 10;
            } else if (kid === 0 && teen === 2) {
              price += selectedDB.d_bb_wd + 38;
            }
          } else if (ad === 2) {
            if (kid === 0 && teen === 0) {
              price += selectedDB.d_bb_wd;
            } else if (kid === 1 && teen === 0) {
              price += selectedDB.d_bb_wd + 10;
            } else if (kid === 1 && teen === 1) {
              price += selectedDB.d_bb_wd + 48;
            } else if (kid === 2 && teen === 0) {
              price += selectedDB.d_bb_wd + 20;
            } else if (kid === 0 && teen === 1) {
              price += selectedDB.d_bb_wd + 38;
            }
          }
        }
        break;
    }
  })
  return price;
}

exports.calculateLoft = (kid, teen, dbRack, dMember, promo) => {
  let price = 0.00;

  if (promo === "member") {
    if (teen === 0 && kid === 0) {
      price = dMember;
    } else if (teen === 1 && kid === 0) {
      price = dMember + 38;
    } else if (teen === 0 && kid === 1) {
      price = dMember + 10;
    }
  } else if (promo === "") {
    if (teen === 0 && kid === 0) {
      price = dbRack;
    } else if (teen === 1 && kid === 0) {
      price = dbRack + 38;
    } else if (teen === 0 && kid === 1) {
      price = dbRack + 10;
    }
  } else if (promo !== "" && promo !== "member") {
    if (teen === 0 && kid === 0) {
      price = dbRack;
    } else if (teen === 1 && kid === 0) {
      price = dbRack + 38;
    } else if (teen === 0 && kid === 1) {
      price = dbRack + 10;
    }

    let discountPrice = getPromoCode(price, promo);
    if (discountPrice === price) {
      return price;
    } else if (discountPrice > price) {
      return price;
    } else {
      price = discountPrice;
      return price;
    }
  }

  return price;
}

exports.calculatePrice = (ad, kid, teen, single, double, dMember, sMember, promo) => {
  let price = 0.00;
  if (promo == "member") {
    console.log("member");
    if (ad == 1) {
      if (kid == 0 && teen == 0) {
        // Single occupancy
        price = sMemeber;
      } else if (kid == 1 && teen == 1) {
        price = dMember + 10;
      } else if ((kid == 1 && teen == 0) || (kid == 0 && teen == 1)) {
        price = dMember;
      } else if (kid == 2 && teen == 0) {
        price = dMember + 10;
      } else if (kid == 0 && teen == 2) {
        price = dMember + 38;
      }
    } else if (ad == 2) {
      if (kid == 0 && teen == 0) {
        price = dMember;
      } else if (kid == 1 && teen == 0) {
        price = dMember + 10;
      } else if (kid == 1 && teen == 1) {
        price = dMember + 48;
      } else if (kid == 2 && teen == 0) {
        price = dMember + 20;
      } else if (kid == 0 && teen == 1) {
        price = dMember + 38;
      }
    }
  } else if (promo == "") { 

    if (ad == 1) {
      if (kid == 0 && teen == 0) {
        // Single occupancy
        price = single;
      } else if (kid == 1 && teen == 1) {
        price = double + 10;
      } else if ((kid == 1 && teen == 0) || (kid == 0 && teen == 1)) {
        price = double;
      } else if (kid == 2 && teen == 0) {
        price = double + 10;
      } else if (kid == 0 && teen == 2) {
        price = double + 38;
      }
    } else if (ad == 2) {
      if (kid == 0 && teen == 0) {
        price = double;
      } else if (kid == 1 && teen == 0) {
        price = double + 10;
      } else if (kid == 1 && teen == 1) {
        price = double + 48;
      } else if (kid == 2 && teen == 0) {
        price = double + 20;
      } else if (kid == 0 && teen == 1) {
        price = double + 38;
      }
    }
  } else if (promo !== "" && promo !== "member") {

    if (ad == 1) {
      if (kid == 0 && teen == 0) {
        // Single occupancy
        price = single;
      } else if (kid == 1 && teen == 1) {
        price = double + 10;
      } else if ((kid == 1 && teen == 0) || (kid == 0 && teen == 1)) {
        price = double;
      } else if (kid == 2 && teen == 0) {
        price = double + 10;
      } else if (kid == 0 && teen == 2) {
        price = double + 38;
      }
    } else if (ad == 2) {
      if (kid == 0 && teen == 0) {
        price = double;
      } else if (kid == 1 && teen == 0) {
        price = double + 10;
      } else if (kid == 1 && teen == 1) {
        price = double + 48;
      } else if (kid == 2 && teen == 0) {
        price = double + 20;
      } else if (kid == 0 && teen == 1) {
        price = double + 38;
      }
    }

    let discountPrice = getPromoCode(price, promo);
    if (discountPrice == price) {
      return price;
    } else if (discountPrice > price) {
      return price;
    } else {
      price = discountPrice;
      return price;
    }
  }
   
  return price;

}

