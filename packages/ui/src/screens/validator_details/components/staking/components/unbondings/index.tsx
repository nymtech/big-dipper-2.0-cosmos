import Loading from '@/components/loading';
import NoData from '@/components/no_data';
import Pagination from '@/components/pagination';
import { usePagination, useScreenSize } from '@/hooks';
import { useProfilesRecoil } from '@/recoil/profiles';
import { useStyles } from '@/screens/validator_details/components/staking/components/unbondings/styles';
import type { UnbondingsType } from '@/screens/validator_details/components/staking/types';
import classnames from 'classnames';
import dynamic from 'next/dynamic';
import * as R from 'ramda';
import React from 'react';

const Desktop = dynamic(
  () =>
    import(
      '@/screens/validator_details/components/staking/components/unbondings/components/desktop'
    )
);
const Mobile = dynamic(
  () =>
    import('@/screens/validator_details/components/staking/components/unbondings/components/mobile')
);

const Unbondings: React.FC<
  {
    unbondings: UnbondingsType;
  } & ComponentDefault
> = (props) => {
  const classes = useStyles();
  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange } = usePagination({});
  const { isDesktop } = useScreenSize();

  const pageItems = R.pathOr<NonNullable<typeof props['unbondings']['data'][number]>>(
    [],
    ['unbondings', 'data', page],
    props
  );
  const dataProfiles = useProfilesRecoil(pageItems.map((x) => x.address));
  const mergedDataWithProfiles = pageItems.map((x, i) => ({
    ...x,
    address: dataProfiles[i],
  }));

  const items = mergedDataWithProfiles;

  let component = null;

  if (props.unbondings.loading) {
    component = <Loading />;
  } else if (!items.length) {
    component = <NoData />;
  } else if (isDesktop) {
    component = <Desktop items={items} />;
  } else {
    component = <Mobile items={items} />;
  }

  return (
    <div className={classnames(props.className)}>
      {component}
      <Pagination
        className={classes.paginate}
        total={props.unbondings.count}
        rowsPerPage={rowsPerPage}
        page={page}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
};

export default Unbondings;